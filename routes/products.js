const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { productSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const { isProductAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    const products = await Product.find({}).populate('expressions');
    res.render('products/index', { products })
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('products/new');
})

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const product = new Product(req.body.product);
    product.author = req.user._id;
    product.editor = req.user._id;
    await product.save();
    req.flash('success', 'Successfully added a new product!');
    res.redirect(`/products/${product._id}`)
}))



router.get('/:id/edit', isLoggedIn, isProductAuthor, catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        req.flash('error', 'this product was deleted');
        return res.redirect('/products');
    }
    res.render('products/edit', { product});
}))

router.get('/:id/close', catchAsync(async (req, res) => {
    const product= await Product.findById(req.params.id)
    if (!product) {
        req.flash('error', 'this product was deleted');
        return res.redirect('/products');
    }
    res.render('products/close', { product});
}))





router.put('/:id', isLoggedIn, isProductAuthor, validateProduct, catchAsync(async (req, res ) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    req.flash('success', 'Successfully updated product!');
    res.redirect(`/products/${product._id}`)
}));


router.get('/:id', catchAsync(async (req, res,) => {
    const product = await Product.findById(req.params.id).populate('expressions').populate('author').populate('editor');
    if (!product) {
        req.flash('error', 'this product was deleted');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
}));


router.delete('/:id', isProductAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted this Product');
    res.redirect('/products');
}))





module.exports = router;
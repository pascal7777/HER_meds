const { productSchema, expressionSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

const Product = require('./models/product');
const Expression = require('./models/expression');





module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}







module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}





module.exports.isProductAuthor = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/products/${id}`);
    }
    next();
}


module.exports.isExpressionAuthor = async (req, res, next) => {
    const { id, expressionId} = req.params;
    const expression= await Expression.findById(expressionId);
    if (!expression.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/expressions/${id}`);
    }
    next();
}



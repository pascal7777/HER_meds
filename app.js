if (process.env.NODE_ENV !== "production"){
require('dotenv').config();
}



const express = require('express');
const morgan = require ('morgan')
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require ('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const Product = require('./models/product');
const Expression = require('./models/expression');
// const comments = require('./models/comment');
// const evaluations = require('./models/evaluation');
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');



const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage});

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local');


const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const expressionRoutes = require('./routes/expressions');
const { constants } = require('buffer');



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/HER'

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))

const secret =process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function(e){
    console.log("Session Store Error")
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoutes);
app.use('/products', productRoutes)
// app.use('/products/:id/expressions', expressions)
app.use('/expressions', expressionRoutes)
// app.use('/expressions/:id/commments', comments)
// app.use('/expressions/:id/evaluations', evaluations)

app.locals.moment = require('moment');





app.get('/', (req,res) => {
    res.render('home')
});


app.get('/products/:id/expressions/new', isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('expressions/new',{product})
}));

app.post('/products/:id/expressions/',   upload.array('image'), isLoggedIn, catchAsync(async(req,res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const { company, manufacturer, mf_country, afda, formulation, strength, unit, standard, packaging, hosp_packaging, packSize, shelflife, storage, warehouse, image, remarks, tel, email, status, current_other, gmp, api, stab, ster, be, packSpec, fpSpec, labelImage, leadTime } = req.body;
    const expression = new Expression ({company, manufacturer, mf_country, afda, formulation, strength, unit, standard, packaging, hosp_packaging, packSize, shelflife, storage, warehouse, image, remarks, tel, email, status, current_other, gmp, api, stab, ster, be, packSpec, fpSpec, labelImage, leadTime });
    product.expressions.push(expression);
    expression.product = product;
    expression.images =  req.files.map(f => ({url: f.path, filename: f.filename }))
    expression.author = req.user._id;
    expression.editor = req.user._id;
    await product.save();
    await expression.save();
    console.log (expression)
    res.redirect(`/products/${id}`)
}))



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
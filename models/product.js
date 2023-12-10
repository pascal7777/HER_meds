const mongoose = require('mongoose');
const Expression = require('./expression');
const { Schema } = mongoose;

const productSchema = new Schema({
    inn: {
        type: String
    },
    formulation: {
        type: String
    },
    strength: {
        type: String
    },
    unit: {
        type: String
    },
    packSize: {
        type: Number
    },
    packaging: {
        type: String
    },
    hosp_packaging: {
        type: String
    },
    remarks: {
        type: String
    },
    shelflife: {
        type: Number,default: 12,
    },
    demand: {
        type: Number,
        min: 0
    }, 
    close: {
        type: Date
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expressions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Expression'
        }
    ],
},
    { timestamps: true }
);

productSchema.post('findOneAndDelete', async function (product) {
    if (product.expressions.length) {
        await Expression.deleteMany({ _id: { $in: product.expressions } })
    }
})

const Product = mongoose.model('Product', productSchema);



module.exports = Product; 
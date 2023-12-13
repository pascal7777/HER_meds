const mongoose = require('mongoose');
const Product = require('./product');
const Comment = require('./comment');
const Evaluation= require('./evaluation');
const { boolean } = require('joi');
const { Schema } = mongoose;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const expressionSchema = new Schema({
    company: {
        type: String
    },
    manufacturer:{
        type: String
    },
    mf_country: {
        type: String
    },
    afda: {
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
    standard: {
        type: String
    },
    packSize: {
        type: Number,
        min: 0
    },
    packaging: {
        type: String
    },
   current_other: {
        type: String
    },
    hosp_packaging: {
        type: String
    },
    shelflife:{
        type: Number
    },
    storage: {
        type: String
    },
    gmp: {
        type: String
    },
    api: {
        type: String
    },
    stab: {
        type: String
    },
    ster: {
        type: String
    },
    be: {
        type: String
    },
    packSpec: {
        type: String
    },
    fpSpec: {
        type: String
    },
    labelImage: {
        type: String
    },
    leadTime: {
        type: String
    },
    remarks: {
        type: String
    },
    email: {
        type: String
    },
    tel: {
        type: String
    },
    status: {
        type: String, default: 'ONLINE CHECK',
        uppercase: true,
        enum: ['ONLINE CHECK','ACCEPT', 'REJECT']
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
    checks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Check'
            }
        ],
    comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
    evaluations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Evaluation'
            }
        ],
    assessments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Assessment'
            }
        ],
    rejects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Reject'
            }
        ],
},
    { timestamps: true }
);


expressionSchema.post('findOneAndDelete', async function (expression) {
    if (expression.comments.length) {
        await Comment.deleteMany({ _id: { $in: expression.comments } })
    }
})

expressionSchema.post('findOneAndDelete', async function (expression) {
    if (expression.evaluations.length) {
        await Evaluation.deleteMany({ _id: { $in: expression.evaluations} })
    }
})




const Expression = mongoose.model('Expression', expressionSchema);



module.exports = Expression; 




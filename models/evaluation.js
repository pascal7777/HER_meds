const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evaluationSchema = new Schema(

    {
        body: String,
        rating: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
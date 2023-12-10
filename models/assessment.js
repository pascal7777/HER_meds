const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentSchema = new Schema(

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

module.exports = mongoose.model("Assessment", assessmentSchema);
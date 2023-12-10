const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rejectSchema = new Schema(

    {
        body: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reject", rejectSchema);
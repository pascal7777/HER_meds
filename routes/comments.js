const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { commentSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');

const Comment = require('../models/comment');

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/', validateComment, catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id);
    const comment = new Comment(req.body.comment );
    expression.comments.push(comment );
    await comment.save();
    await expression.save();
    res.redirect(`/expressions/${expression._id}`);
}))

router.delete('/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/expressions/${id}`);
}))


module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { evaluationSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');

const Evaluation = require('../models/evaluation');


const validateEvaluation = (req, res, next) => {
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateEvaluation, catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id);
    const evaluation = new Evaluation(req.body.evaluation );
    expression.evaluations.push(evaluation );
    await evaluation.save();
    await expression.save();
    res.redirect(`/expressions/${expression._id}`);
}))

router.delete('/:evaluationId', catchAsync(async (req, res) => {
    const { id, evaluationId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { evaluations: evaluationId } });
    await Evaluation.findByIdAndDelete(evaluationId);
    res.redirect(`/expressions/${id}`);
}))

module.exports = router;
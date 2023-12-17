const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        inn: Joi.string().allow('', null),
        strength: Joi.string().allow('', null),
        unit: Joi.string().allow('', null),
        packSize: Joi.number().allow('', null).min(0),
        packaging: Joi.string().allow('', null),
        hosp_packaging: Joi.string().allow('', null),
        demand: Joi.number().allow('', null),
        shelflife: Joi.number().allow('', null),
        remarks: Joi.string().allow('', null),
        formulation: Joi.string().allow('', null),
        close: Joi.string().allow('', null)
    }).required()
});

module.exports.expressionSchema = Joi.object({
    expression: Joi.object({
        company: Joi.string().required(),
        manufacturer: Joi.string().allow('', null),
        mf_country: Joi.string().required(),
        afda: Joi.string().required(),
        remarks: Joi.string().required(),
        standard: Joi.string().required(),
        formulation:Joi.string().required(),
        strength: Joi.string().required(),
        unit: Joi.string().required(),
        packSize: Joi.number().required(),
        packaging: Joi.string().required(),
        shelflife: Joi.string().required(),
        gmp: Joi.string().required(),
        api: Joi.string().required(),
        stab: Joi.string().required(),
        ster: Joi.string().required(),
        be: Joi.string().required(),
        packSpec: Joi.string().required(),
        fpSpec: Joi.string().required(),
        labelImage: Joi.string().required(),
        leadTime: Joi.string().required(),
        storage: Joi.string().required(),
        warehouse: Joi.string().required(),
        tel: Joi.string().required(),
        email: Joi.string().required(),
        status: Joi.string().required(),
        current_other: Joi.string().allow('', null),
    }).required(),
    deleteImages:Joi.array()
});

module.exports.checkSchema = Joi.object({
    check: Joi.object({
        rating: Joi.number().allow('', null).min(1).max(10),
        body: Joi.string().required()
    }).required()
});


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        rating: Joi.number().allow('', null).min(1).max(10),
        body: Joi.string().required()
    }).required()
});

module.exports.evaluationSchema = Joi.object({
    evaluation: Joi.object({
        rating: Joi.number().allow('', null).min(1).max(10),
        body: Joi.string().required()
    }).required()
});

module.exports.assessmentSchema = Joi.object({
    assessment: Joi.object({
        rating: Joi.number().allow('', null).min(1).max(10),
        body: Joi.string().required()
    }).required()
});

module.exports.rejectSchema = Joi.object({
    reject: Joi.object({
        body: Joi.string().required()
    }).required()
});
import Joi from "joi";

const create = Joi.object({
    name: Joi.string().max(30).required(),
});

const subscribe = Joi.object({
    url: Joi.string().required(),
});
const publish = Joi.object({
    data: Joi.object().required(),
});

const ping = Joi.object({
    topic: Joi.string().required(),
    data: Joi.object().required(),
});

export default { create, subscribe, publish, ping };

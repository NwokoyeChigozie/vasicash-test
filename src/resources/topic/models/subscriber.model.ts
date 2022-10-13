import { Schema, model } from "mongoose";
import Subscriber from "@/resources/topic/interfaces/subscriber.interface";

const SubscriberSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

SubscriberSchema.methods.isValidUrl = async function (
    url: string
): Promise<Error | boolean> {
    let urlRegex =
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(url);
};

export default model<Subscriber>("Subscriber", SubscriberSchema);

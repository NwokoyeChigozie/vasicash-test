import { Schema, model } from "mongoose";
import Message from "@/resources/topic/interfaces/message.interface";

const MessageSchema = new Schema(
    {
        topic: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<Message>("Message", MessageSchema);

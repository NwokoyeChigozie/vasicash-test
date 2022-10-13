import { Schema, model, plugin } from "mongoose";
import Topic from "@/resources/topic/interfaces/topic.interface";
import slug from "mongoose-slug-updater";
plugin(slug);

const TopicSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            slug: "name",
        },
    },
    { timestamps: true }
);

export default model<Topic>("Topic", TopicSchema);

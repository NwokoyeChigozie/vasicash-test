import { Document } from "mongoose";

export default interface Topic extends Document {
    name: string;
    slug: string;
}

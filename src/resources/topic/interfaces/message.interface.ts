import { Document } from "mongoose";

export default interface Message extends Document {
    topic: string;
    data: any;
}

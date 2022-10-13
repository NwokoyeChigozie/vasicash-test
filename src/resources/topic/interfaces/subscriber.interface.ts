import { Document } from "mongoose";

export default interface Subscriber extends Document {
    url: string;
    topic: string;

    isValidUrl(url: string): Promise<Error | boolean>;
}

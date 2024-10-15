import exp from "constants";
import { Document } from "mongoose";

export class CreateUIDto extends Document {
    readonly banners: string[];
}
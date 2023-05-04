import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import translationSchema from "./translation";

export const countrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: null,
  },
  translation: [translationSchema],
});

export const Country = mongoose.model("Country", countrySchema);

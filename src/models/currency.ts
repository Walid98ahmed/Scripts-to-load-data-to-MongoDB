import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import translationSchema from "./translation";

export const currencySchema = new Schema({
  code: {
    type: String,
  },
  symbol: {
    type: String,
  },
  name: {
    type: String,
  },
  translation: [translationSchema],
});

export const Currency = mongoose.model("Currency", currencySchema);

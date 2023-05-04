import * as mongoose from "mongoose";
import translationSchema from "./translation";
import { Schema } from "mongoose";

export const stateSchema: Schema = new Schema({
  name: String,
  code: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number],
  },
  translation: [translationSchema],
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
    autopopulate: true,
  },
});

stateSchema.plugin(require("mongoose-autopopulate"));

export const State = mongoose.model("State", stateSchema);

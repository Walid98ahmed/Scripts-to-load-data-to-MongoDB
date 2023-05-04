import * as mongoose from "mongoose";
import translationSchema from "./translation";
import { Schema } from "mongoose";

 export const citySchema: Schema = new Schema({
  agoda_city_id: String,
  distribusion_code: String,
  combigo_code: String,
  name: String,
  code: String,
  imageAlt: String,
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
  updatedAt: Date,
});

citySchema.plugin(require("mongoose-autopopulate"));

export const City = mongoose.model("City", citySchema);

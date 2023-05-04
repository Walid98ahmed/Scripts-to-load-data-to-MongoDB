import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export const imageSchema = new Schema(
  {
    pathWithFilename: String,
    mime: String,
    filename: String,
    path: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const Image = mongoose.model("Image", imageSchema);

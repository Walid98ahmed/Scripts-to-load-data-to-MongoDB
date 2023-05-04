import * as mongoose from "mongoose";

type StationDocument = mongoose.Document & {
  name: string;
  code: string;
  timezone: string;
  description: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  kiwi_code: string;
  type: string;
  distribusion_code: string;
  saveatrain_code: string;
  combigo_code: string;
  isActive: boolean;
  city: mongoose.Schema.Types.ObjectId;
  translation: {
    language: string;
    name: string;
    description: string;
  }[];
};

export const stationSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
  address: String,
  kiwi_code: String,
  combigo_code: String,
  distribusion_code: String,
  saveatrain_code: String,
  timezone: String,
  type: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: [Number],
  },
  isActive: Boolean,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    autopopulate: true,
  },
  translation: [
    {
      language: String,
      name: String,
      description: String,
    },
  ],
});
stationSchema.plugin(require("mongoose-autopopulate"));

export const Station = mongoose.model<StationDocument>(
  "Station",
  stationSchema
);

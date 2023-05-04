import mongoose from "mongoose";

const AircraftSchema = new mongoose.Schema({
  type: String,
  model: String,
});

const Aircraft = mongoose.model("aircrafts", AircraftSchema);

export { Aircraft };

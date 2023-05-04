import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import app from "./app";
import connectDB from "./config/db";
import seedHotelsId from "./controller/hotel.controllers";
import seedCityDB from "./controller/city.controllers";
import seedStationDB from "./controller/station.controllers";
import { AircraftSeeding } from "./controller/aircraftTypes.controllers";

const PORT = process.env.PORT || 9000;

async function start() {
  await connectDB();
  // seedHotelsId();
  // AircraftSeeding();
  // seedCityDB();
  // seedStationDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port: ${PORT} 🚀`);
  });
}

start();

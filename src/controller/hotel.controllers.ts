import mongoose from "mongoose";
import axios from "axios";
import csvtojson from "csvtojson";
import { stringSimilarity } from "../controller/similarity";
import { City } from "../models/city";
import { Country } from "../models/country";
import Hotel from "../models/hotel";

const { PROVIDER_X_PROPERTIES_API, PROVIDER_X_API_KEY, PROVIDER_X_AUTH_TOKEN } =
  process.env;

const BATCH_SIZE = 1000;

const seedHotelsId = async () => {
  try {
    console.log("<<<<<<<<<<<<<<<<<<<Start Seeding>>>>>>>>>>>>>>>>>>>>>>>>");

    const response = await axios.get(
      `${PROVIDER_X_PROPERTIES_API}?api_key=${PROVIDER_X_API_KEY}&auth_token=${PROVIDER_X_AUTH_TOKEN}`
    );

    const allpropertiesData = await csvtojson().fromString(response.data);

    console.log("allpropertiesData.length:", allpropertiesData.length);

    const hotels: any = [];

    for (let i = 0; i < allpropertiesData.length; i += BATCH_SIZE) {
      const batchData = allpropertiesData.slice(i, i + BATCH_SIZE);

      const batchHotels = await Promise.all(
        batchData.map(async (item: any) => {
          const {
            id,
            name,
            street_address,
            latitude,
            longitude,
            locality,
            postal_code,
            country,
          } = item;

          const countryCode = await Country.findOne({
            code: country,
          });

          if (!countryCode) {
            return null;
          }

          const city = await City.findOne({
            country: countryCode._id,
            name: {
              $regex: locality,
              $options: "i",
            },
          });

          if (!city) {
            return null;
          }

          const newHotelDoc = {
            hotel_id: id,
            hotel_name: name,
            addresses: street_address,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            city_ref: city._id,
            locality,
            getaroom_id: id,
            postal_code,
          };

          const foundHotelDoc = await Hotel.findOne({
            city_ref: city._id,
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                $maxDistance: 1000,
                $minDistance: 0,
              },
            },
          });

          if (foundHotelDoc) {
            foundHotelDoc.getaroom_id = id;
            return foundHotelDoc;
          } else {
            return newHotelDoc;
          }
        })
      );

      hotels.push(...batchHotels.filter((hotel) => hotel !== null));
      console.log(`Pushed batch ${i / BATCH_SIZE + 1}`);
    }

    await Hotel.insertMany(hotels, { ordered: false });

    console.log("Data seeded");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

export default seedHotelsId;

import * as mongoose from "mongoose";
import { Schema } from "mongoose";

type HotelDocument = mongoose.Document & {
  hotel_id: string;
  hotel_name: string;
  chain: {
    name: string;
    code: string;
  };
  brand: {
    name: string;
    code: string;
  };
  getaroom_id: string;
  chain_id: string;
  chain_name: string;

  addresses: string[];
  location: {
    type: string;
    coordinates: number[];
  };
  city_ref: mongoose.Schema.Types.ObjectId;
  postal_code: string;
  country: mongoose.Schema.Types.ObjectId;
};

export const hotelSchema: mongoose.Schema = new mongoose.Schema(
  {
    hotel_id: String,
    getaroom_id: String,
    postal_code: String,
    chain_id: String,
    chain_name: String,
    chain: {
      type: Schema.Types.ObjectId,
      ref: "Chain",
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    brand_id: String,
    brand_name: String,
    hotel_name: String,
    hotel_formerly_name: String,
    hotel_translated_name: String,
    addresses: [String],
    addressline1: String,
    addressline2: String,
    zipcode: String,
    city: String,
    state: String,
    country: String,
    countryisocode: String,
    star_rating: String,
    longitude: String,
    latitude: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },
    url: String,
    checkin: String,
    checkout: String,
    numberrooms: String,
    numberfloors: String,
    yearopened: String,
    yearrenovated: String,
    photos: [String],
    photo1: String,
    photo2: String,
    photo3: String,
    photo4: String,
    photo5: String,
    overview: String,
    rates_from: String,
    continent_id: String,
    continent_name: String,
    city_id: String,
    country_id: String,
    number_of_reviews: String,
    rating_average: String,
    rates_currency: String,
    rates_from_exclusive: String,
    accommodation_type: String,
    city_ref: {
      type: Schema.Types.ObjectId,
      ref: "City",
    },
  },
  {
    collection: "hotels",
  }
);

const Hotel = mongoose.model<HotelDocument>("Hotel", hotelSchema);

export default Hotel;

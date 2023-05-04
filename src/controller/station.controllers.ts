import * as mongoose from "mongoose";
const { COMBIGO_API_URL } = process.env;
import axios from "axios";
import { City } from "../models/city";
import { Station } from "../models/station";
import { Country } from "../models/country";
import { stringSimilarity } from "./similarity";

interface IDictionary<TValue> {
  [id: string]: TValue;
}

const stationMapping: IDictionary<string> = {
  TRAIN: "train_station",
  BUS: "bus_station",
  BOAT: "ferry_station",
};

const languages: string[] = [
  "ar",
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "eo",
  "es",
  "et",
  "eu",
  "fi",
  "fr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "ms",
  "nb",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "zh",
  "tl",
];

type doc = {
  name: string;
  code: string;
  address: string;
  timezone: string;
  location: {
    type: string;
    coordinates: number[];
  };
  isActive: boolean;
  type: string;
  city: mongoose.Schema.Types.ObjectId;
  translation: {
    language: string;
    name: string;
  }[];
  combigo_code: string;
};

const seedStationDB = async () => {
  let results = await axios
    .get(`${COMBIGO_API_URL}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "c1ac3d9a-8dae5c-fb72b2cc-fe35eb",
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {};
    });

  results = results.filter(
    (item: any) => item.type !== "PLANE" || item.type !== ""
  );

  const notFoundCities: string[] = [];
  for (const item of results) {
    const {
      name,
      type,
      active,
      address,
      city: cityName,
      tz,
      id,
      location,
      nameIntl,
      codeCountry,
    } = item;

    const country = await Country.findOne({
      code: codeCountry,
    });

    if (!country) {
      continue;
    }

    const city = await City.findOne({
      country: country._id,
      name: {
        $regex: cityName,
        $options: "i",
      },
    });

    if (!city) {
      notFoundCities.push(cityName);
      continue;
    }

    const nameOfCity = await City.findOne({
      name: cityName,
    });

    if (nameOfCity) {
      continue;
    }

    const doc: doc = {
      name,
      code: id,
      address: address.formatted,
      timezone: tz,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat],
      },
      isActive: active,
      type: stationMapping[type],
      city: city._id as mongoose.Schema.Types.ObjectId,
      translation: [],
      combigo_code: id,
    };

    for (const language of languages) {
      if (nameIntl[language]) {
        doc.translation.push({
          language,
          name: nameIntl[language],
        });
      } else {
        doc.translation.push({
          language,
          name: `${name}-${language}`,
        });
      }
    }

    const stationsFromCombigo = await Station.findOne({
      code: doc.code,
    });

    if (stationsFromCombigo) {
      continue;
    }

    let flag = true;

    const foundedDoc = await Station.findOne({
      isActive: true,
      type: doc.type,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.lng, location.lat],
          },
          $maxDistance: 1000,
          $minDistance: 10,
        },
      },
    });

    if (!foundedDoc) {
      continue;
    }

    const similarity = stringSimilarity(doc.name, foundedDoc.name as string);

    similarity < 0.5 ? (flag = false) : (flag = true);

    if (flag) {
      foundedDoc.combigo_code = id;
      await foundedDoc.save();
    } else {
      await Station.create(doc);
    }
  }
  console.log("Data Seeded");
  mongoose.connection.close();
};
export default seedStationDB;

import axios from "axios";
import mongoose from "mongoose";
import { City } from "../models/city";
import { Country } from "../models/country";

const { PROVIDER_Y_API_URL_administratives, PROVIDER_Y_API_KEY } = process.env;

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

const seedCityDB = async () => {
  let results = await axios
    .get(`${PROVIDER_Y_API_URL_administratives}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PROVIDER_Y_API_KEY,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {};
    });

  results = results.filter((item: any) => item.type === "CITY");

  for (const item of results) {
    const { name, idSya, location, nameIntl, codeCountry } = item;
    const country = await Country.findOne({
      code: codeCountry,
    });

    if (!country) {
      console.log(`${codeCountry} not found`);
      continue;
    }

    const city = await City.findOne({
      $or: [
        {
          country: country._id,
          name: {
            $regex: name,
            $options: "i",
          },
        },
        {
          code: idSya,
        },
      ],
    });

    if (!city) {
      console.log(`${name} not found`);
      const cityObj: any = {
        name,
        code: idSya,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
        country: country._id,
        translation: [],
      };

      for (const language of languages) {
        if (item.nameIntl[language]) {
          cityObj.translation.push({
            language,
            name: item.nameIntl[language],
          });
        } else {
          cityObj.translation.push({
            language,
            name: `${name}-${language}`,
          });
        }
      }

      await City.create(cityObj);
    } else {
      console.log(`${name} found`);
    }
  }
  console.log("data seeded");
  mongoose.connection.close();
};
export default seedCityDB;

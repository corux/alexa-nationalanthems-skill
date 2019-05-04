import { ContinentCode, ICountry } from "@corux/country-data";
import countries from "../data/countries";

function getRandomEntry(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomCountry(continent: ContinentCode, lang: string): ICountry {
  const matchesContinent = (country: ICountry) => {
    return country.continent && continent === country.continent.code;
  };
  return getRandomEntry(countries.getAll(lang)
    .filter((val) => val.anthem.url && (!continent || matchesContinent(val))));
}

export function getAnthemUrl(country: ICountry, longVersion: boolean = false) {
  const folder = longVersion ? "mp3s-full" : "mp3s";
  return `https://s3-eu-west-1.amazonaws.com/alexa-nationalanthems-skill/${folder}/${country.iso3}.mp3`;
}

import { ICountry, Region } from "country-data";
import countries from "../countries";

function getRandomEntry(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRegionFromString(continent: string): Region[] {
  switch ((continent || "").toUpperCase()) {
    case "EUROPA":
    case "EU":
      return [Region.EUROPE];
    case "AFRIKA":
    case "AF":
      return [Region.AFRICA];
    case "AMERIKA":
    case "AM":
      return [Region.AMERICAS, Region.SOUTH_AMERICA, Region.NORTH_AMERICA];
    case "ASIEN":
    case "AS":
      return [Region.ASIA];
    case "OZEANIEN":
    case "OC":
      return [Region.OCEANIA];
    case "SA":
      return [Region.SOUTH_AMERICA];
    case "NA":
      return [Region.NORTH_AMERICA];
    default:
      return [];
  }
}

export function getRandomCountry(continent: string, lang: string): ICountry {
  const regions = getRegionFromString(continent);
  const matchesContinent = (country: ICountry) => {
    return country.region && regions.indexOf(country.region) !== -1;
  };
  return getRandomEntry(countries.getAll(lang)
    .filter((val) => val.anthem && (regions.length === 0 || matchesContinent(val))));
}

export function getAnthemUrl(country: ICountry) {
  return `https://s3-eu-west-1.amazonaws.com/alexa-countryquiz-skill-anthems/${country.iso3}.mp3`;
}

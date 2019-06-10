import { Locale } from "@corux/ask-extensions";
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

export function getTArgument(country: ICountry, locale?: Locale): ({ country: string, preposition: string }) {
  let preposition = "";
  if (locale === "pt-BR") {
    if (country.article === "a") {
      preposition = "da";
    } else if (country.article === "o") {
      preposition = "do";
    } else {
      preposition = "de";
    }
  }

  return {
    country: country.name,
    preposition,
  };
}

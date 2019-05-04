import { ICountry } from "@corux/country-data";
import { ExtendedCountryData } from "./ExtendedCountryData";

const cache = {};

function getInstance(lang: string): ExtendedCountryData {
  const countryData = cache[lang] || (cache[lang] = new ExtendedCountryData(lang));
  return countryData;
}

export default {
  getAll: (lang: string): ICountry[] => {
    return getInstance(lang).getCountries();
  },
  getByIso3: (iso: string, lang: string): ICountry => {
    return getInstance(lang).getCountries()
      .find((value) => value.iso3 && iso && value.iso3.toUpperCase() === iso.toUpperCase());
  },
};

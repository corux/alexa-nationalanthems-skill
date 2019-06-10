import { CountryData, ICountry } from "@corux/country-data";

import generic = require("./generic.json");

import * as de from "./de.json";
import * as en from "./en.json";

const dataExtension: { [lang: string]: any } = {
  de, en,
};

export class ExtendedCountryData extends CountryData {
  constructor(private readonly language: string) {
    super(language);
    this.language = language.substring(0, 2);
  }

  public getCountries(): ICountry[] {
    const i18nData = dataExtension[this.language] || {};
    const data = generic.map((val) => {
      const result = Object.assign({}, val, i18nData[val.iso3]);
      result.anthem.url = val.anthem.url;
      result.anthem.vocalUrl = val.anthem.vocalUrl;
      return result;
    });
    return super.getCountries().concat(data);
  }
}

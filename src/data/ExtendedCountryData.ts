import { CountryData, ICountry } from "@corux/country-data";

import * as generic from "./generic.json";

import * as de from "./de.json";

const dataExtension: {[lang: string]: any} = {
  de,
};

export class ExtendedCountryData extends CountryData {
  constructor(private readonly language: string) {
    super(language);
    this.language = language.substring(0, 2);
  }

  public getCountries(): ICountry[] {
    const i18nData = dataExtension[this.language] || {};
    const data = generic.map((val) => Object.assign({}, val, i18nData[val.iso3]));
    return super.getCountries().concat(data);
  }
}

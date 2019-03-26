import { CountryData, ICountry } from "@corux/country-data";

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
    return super.getCountries().concat(dataExtension[this.language] || []);
  }
}

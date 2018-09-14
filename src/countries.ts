import { CountryData, ICountry } from "country-data";

export default {
  getAll: (): ICountry[] => {
    return new CountryData("de").getCountries();
  },
  getByIso3: (iso: string): ICountry => {
    return new CountryData("de").getCountries()
      .find((value) => value.iso3 && iso && value.iso3.toUpperCase() === iso.toUpperCase());
  },
};

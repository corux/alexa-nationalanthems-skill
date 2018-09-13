import * as countries from "./data.json";

export default {
  getAll: (): [Country] => {
    return countries;
  },
  getByIso3: (iso: string): Country => {
    return countries.find((value) => value.iso3 && iso && value.iso3.toUpperCase() === iso.toUpperCase());
  },
};

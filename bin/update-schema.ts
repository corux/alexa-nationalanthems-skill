import { getRegions } from "@corux/country-data/dist/regions";
import * as fs from "fs";
import * as nomnom from "nomnom";
import * as path from "path";
import * as process from "process";
import countries from "../src/countries";

const exists = (filename) => fs.existsSync(filename)
  ? undefined
  : `${filename} does not exist`;

const { file, lang } = nomnom
  .script("update-schema")
  .option("file", { required: true, callback: exists })
  .option("lang", { required: true })
  .parse();

const schema = JSON.parse(fs.readFileSync(file).toString());
const all = countries.getAll(lang);

function getAdjective(adjective: string) {
  switch (lang) {
    case "de":
      return `${adjective}e`;
    case "en":
      return adjective;
  }

  return adjective;
}

const countryOutput: any = {
  name: "COUNTRY",
};
countryOutput.values = all.filter((country) => country && country.iso3 && country.name)
  .map((country) => {
    let synonyms = [].concat(
      country.longName !== country.name ? [country.longName] : [],
      country.altNames || [],
      (country.adjectives || []).map((adj) => getAdjective(adj)),
    ).filter((n) => !!n);
    synonyms = synonyms.filter((n, i) => synonyms.indexOf(n) === i);
    return {
      iso3: country.iso3,
      name: country.name,
      synonyms: synonyms.length ? synonyms : undefined,
    };
  })
  .map((country) => ({
    id: country.iso3,
    name: {
      value: country.name,
      // tslint:disable-next-line:object-literal-sort-keys
      synonyms: country.synonyms,
    },
  }));

const continentOutput: any = {
  name: "CONTINENT",
};
continentOutput.values = getRegions(lang)
  .map((region) => ({
    id: region.code,
    name: {
      value: region.name,
    },
  }));

schema.interactionModel.languageModel.types = [continentOutput, countryOutput];

const schemaFile = path.join(process.cwd(), file);
fs.writeFile(schemaFile, JSON.stringify(schema, null, 2), "utf8", (err) => {
  if (err) {
    process.exit(1);
  }
});

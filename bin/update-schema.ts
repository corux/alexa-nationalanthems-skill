import * as program from "commander";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import countries from "../src/data/countries";

program
  .option("--file <path>", "Schema file to update.")
  .option("--lang <code>", "Language code to use")
  .parse(process.argv);

const file = program.file;
const lang = program.lang;

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
      [country.longName],
      country.altNames,
      (country.adjectives || []).map((adj) => getAdjective(adj)),
    ).filter((n) => !!n);
    synonyms = synonyms
      .filter((n, i) => synonyms.indexOf(n) === i)
      .filter((val) => val.toUpperCase() !== country.name.toUpperCase());
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

schema.interactionModel.languageModel.types = [countryOutput];

const schemaFile = path.join(process.cwd(), file);
fs.writeFile(schemaFile, JSON.stringify(schema, null, 2), "utf8", (err) => {
  if (err) {
    process.exit(1);
  }
});

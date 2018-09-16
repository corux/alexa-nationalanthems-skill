import * as fs from 'fs';
import * as path from 'path';
import * as nomnom from 'nomnom';
import * as process from 'process';
import countries from '../src/countries';
import { getRegions } from 'country-data/dist/regions';

const exists = (filename) => fs.existsSync(filename)
  ? undefined
  : `${filename} does not exist`;

let { file, lang } = nomnom
  .script('update-schema')
  .option('file', { required: true, callback: exists })
  .option('lang', { required: true })
  .parse();

const schema = JSON.parse(fs.readFileSync(file).toString());
const all = countries.getAll(lang);

function getAdjective(lang: string, adjective: string) {
  switch (lang) {
    case "de":
      return `${adjective}e`;
  }

  return adjective;
}

const country: any = {
  name: 'COUNTRY'
};
country.values = all.filter(country => !!country && !!country.iso3 && !!country.name)
  .map(country => {
    let synonyms = [].concat(
      country.longName !== country.name ? [country.longName] : [],
      country.altNames || [],
      (country.adjectives || []).map(adj => getAdjective(lang, adj))
    ).filter(n => !!n);
    synonyms = synonyms.filter((n, i) => synonyms.indexOf(n) === i);
    return {
      iso3: country.iso3,
      name: country.name,
      synonyms: synonyms.length ? synonyms : undefined,
    };
  })
  .map(country => ({
    id: country.iso3,
    name: {
      value: country.name,
      synonyms: country.synonyms
    }
  }));

const continent: any = {
  name: 'CONTINENT'
};
continent.values = getRegions(lang)
  .map(region => ({
    id: region.code,
    name: {
      value: region.name
    }
  }));

schema.interactionModel.languageModel.types = [continent, country];

const schemaFile = path.join(process.cwd(), file);
fs.writeFile(schemaFile, JSON.stringify(schema, null, 2), 'utf8', (err) => {
  if (err) {
    process.exit(1);
  }
});

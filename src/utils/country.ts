import countries from "../countries";

function getRandomEntry(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomCountry(continent: string): Country {
  const matchesContinent = (country) => {
    return continent && country.region && country.region.toUpperCase() === continent.toUpperCase();
  };
  return getRandomEntry(countries.getAll()
    .filter((val) => val.anthem && (!continent || matchesContinent(val))));
}

export function getAnthemUrl(country: Country) {
  return `https://s3-eu-west-1.amazonaws.com/alexa-countryquiz-skill-anthems/${country.iso3}.mp3`;
}

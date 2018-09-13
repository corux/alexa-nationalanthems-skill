declare module "*.json" {
    const value: any;
    export = value;
}

interface Country {
    name: string;
    longName: string;
    altNames: [string];
    capital: string;
    population: number;
    flag: { smallImageUrl: string, largeImageUrl: string };
    iso3: string;
    iso2: string;
    region: string;
    languages: [string];
    currencies: [string];
    borders: [string];
    anthem: string;
    adjectives: [string]
}

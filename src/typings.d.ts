declare module "*.json" {
  const value: any;
  export = value;
}

type Locale = "en-US" | "en-CA" | "en-IN" | "en-AU" | "en-GB"
  | "es-ES" | "es-MX" | "es-US"
  | "fr-FR"
  | "it-IT"
  | "de-DE"
  | "pt-BR";

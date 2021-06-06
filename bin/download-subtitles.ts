import { program } from "commander";
import * as fs from "fs";
import * as https from "https";
import * as process from "process";
import countries from "../src/data/countries";

program
  .option(
    "--destination <path>",
    "The destination folder, where all WebVTT subtitles will be saved in."
  )
  .option("--overwrite", "Determines if existing files will be overwritten.")
  .parse(process.argv);

const destination = program.destination;
const overwrite = program.overwrite;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const data = countries.getAll("en");

for (const country of data) {
  for (const [subtitleLang, srtUrl] of Object.entries(
    country.anthem.subtitles || {}
  )) {
    if (country.anthem.subtitles) {
      const output = `${destination}/${country.iso3}_${subtitleLang}.vtt`;
      if (overwrite || !fs.existsSync(output)) {
        const url = srtUrl.replace("trackformat=srt", "trackformat=vtt");
        https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.on("data", (d) => {
              fs.writeFileSync(output, d);
            });
          } else {
            console.error(
              `Failed to download subtitle for country "${country.name}" in language "${subtitleLang}" (Status code ${response.statusCode})`
            );
          }
        });
      } else {
        console.log(
          `Subtitle for country "${country.name}" in language "${subtitleLang}" already exists.`
        );
      }
    }
  }
}

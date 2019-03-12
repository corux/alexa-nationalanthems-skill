import { spawn } from "child_process";
import * as program from "commander";
import * as fs from "fs";
import * as process from "process";
import countries from "../src/countries";

program
  .option("--destination <path>", "The destination folder, where all converted mp3 will be saved in.")
  .option("--overwrite", "Determines if existing mp3 files will be overwritten.")
  .parse(process.argv);

const destination = program.destination;
const overwrite = program.overwrite;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const data = countries.getAll("en");

for (const country of data) {
  if (country.anthem) {
    const output = `${destination}/${country.iso3}.mp3`;
    if (overwrite || !fs.existsSync(output)) {
      const maxLengthInSeconds = "88";
      const proc = spawn("ffmpeg", ["-i", country.anthem,
        "-t", maxLengthInSeconds, "-ac", "2", "-codec:a", "libmp3lame",
        "-b:a", "48k", "-ar", "16000", "-y", output]);
      proc.on("close", (code) => {
        if (code === 0) {
          console.info(`Anthem for country "${country.name}" successfully converted.`);
        } else {
          console.error(`Failed to convert anthem for country "${country.name}".`);
        }
      });
    } else {
      console.log(`Anthem for country "${country.name}" already exists.`);
    }
  } else {
    console.info(`No anthem found for country "${country.name}"`);
  }
}

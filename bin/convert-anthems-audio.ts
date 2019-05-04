import { spawn } from "child_process";
import * as program from "commander";
import * as fs from "fs";
import * as process from "process";
import countries from "../src/data/countries";

program
  .option("--destination <path>", "The destination folder, where all converted mp3 will be saved in.")
  .option("--overwrite", "Determines if existing mp3 files will be overwritten.")
  .option("--duration <seconds>", "The maximum duration in seconds of the generated mp3 files")
  .parse(process.argv);

const destination = program.destination;
const overwrite = program.overwrite;
const duration = program.duration;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const data = countries.getAll("en");

for (const country of data) {
  if (country.anthem.url) {
    const output = `${destination}/${country.iso3}.mp3`;
    if (overwrite || !fs.existsSync(output)) {
      const proc = spawn("ffmpeg", ["-i", country.anthem.url,
        "-t", duration, "-ac", "2", "-codec:a", "libmp3lame",
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

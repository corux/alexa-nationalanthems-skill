import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("PlayAnthemIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
  });

  test("Should ask for anthem if no country was provided", async () => {
    const result = await alexa.intend("PlayAnthemIntent");

    expect(result.response.outputSpeech.ssml).toContain("Which national anthem do you want to play?");
    expect(result.response.shouldEndSession).toBe(false);
  });

  test("Should play anthem for country with available anthem", async () => {
    const result = await alexa.intend("PlayAnthemIntent", {
      country: "Germany",
    });

    expect(result.response.outputSpeech.ssml).toContain("Here's the national anthem of Germany.");
    expect(result.response.outputSpeech.ssml).toContain("/mp3s/DEU.mp3");
    expect(result.response.shouldEndSession).toBe(false);
  });

  test("Should tell if anthem of selected country is unavailable", async () => {
    const result = await alexa.intend("PlayAnthemIntent", {
      country: "South Ossetia",
    });

    expect(result.response.outputSpeech.ssml).toContain("I don't know the national anthem of South Ossetia.");
    expect(result.response.shouldEndSession).toBe(false);
  });
});

import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.RepeatIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
  });

  test("Should not fail if there is nothing to repeat", async () => {
    const result = await alexa.intend("AMAZON.RepeatIntent");

    expect(result.response.outputSpeech.ssml).toContain("There is nothing to repeat.");
    expect(result.response.shouldEndSession).toBe(false);
  });

  test("Should repeat the previous anthem", async () => {
    const playResult = await alexa.intend("PlayAnthemIntent", {
      country: "Germany",
    });

    expect(playResult.response.outputSpeech.ssml).toContain("Here's the national anthem of Germany.");
    expect(playResult.response.outputSpeech.ssml).toContain("/mp3s/DEU.mp3");

    const repeatResult = await alexa.intend("AMAZON.RepeatIntent");

    expect(repeatResult.response.outputSpeech.ssml).not.toContain("Here's the national anthem of Germany.");
    expect(repeatResult.response.outputSpeech.ssml).toContain("/mp3s/DEU.mp3");
    expect(repeatResult.response.shouldEndSession).toBe(false);
  });
});

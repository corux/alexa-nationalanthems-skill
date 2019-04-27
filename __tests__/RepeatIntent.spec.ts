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
});

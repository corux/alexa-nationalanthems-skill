import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("LaunchRequest", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
  });

  test("Ask for anthem", async () => {
    const result = await alexa.launch();

    expect(result.response.outputSpeech.ssml).toContain("Which national anthem do you want to play?");
    expect(result.response.shouldEndSession).toBe(false);
  });
});

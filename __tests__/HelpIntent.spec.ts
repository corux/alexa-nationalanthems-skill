import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.HelpIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
  });

  it("Provide help message", async () => {
    const result: any = await alexa.utter("help");
    expect(result.response.outputSpeech.ssml).toContain("play the national anthem for different countries");
    expect(result.response.shouldEndSession).toBe(false);
  });

});

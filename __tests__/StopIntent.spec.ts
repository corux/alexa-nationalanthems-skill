import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("AMAZON.StopIntent, AMAZON.CancelIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  it("StopIntent ends session", async () => {
    const result: any = await alexa.utter("stop");
    expect(result.response.outputSpeech.ssml).toContain("stop");
    expect(result.response.shouldEndSession).toBe(true);
  });

  it("CancelIntent ends session", async () => {
    const result: any = await alexa.utter("cancel");
    expect(result.response.outputSpeech.ssml).toContain("stop");
    expect(result.response.shouldEndSession).toBe(true);
  });
});

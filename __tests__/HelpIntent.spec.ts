import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("AMAZON.HelpIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  it("Provide help message", async () => {
    const result: any = await alexa.intend("AMAZON.HelpIntent");
    expect(result.response.outputSpeech.ssml).toContain("help");
    expect(result.response.shouldEndSession).toBe(false);
  });
});

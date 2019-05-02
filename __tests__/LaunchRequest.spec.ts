import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("LaunchRequest", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Ask for anthem", async () => {
    const result = await alexa.launch();

    expect(result.response.outputSpeech.ssml).toContain("launch");
    expect(result.response.shouldEndSession).toBe(false);
  });
});

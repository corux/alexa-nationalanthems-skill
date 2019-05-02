import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("AMAZON.RepeatIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Should not fail if there is nothing to repeat", async () => {
    const result = await alexa.intend("AMAZON.RepeatIntent");

    expect(result.response.outputSpeech.ssml).toContain("repeat");
    expect(result.response.shouldEndSession).toBe(false);
  });
});

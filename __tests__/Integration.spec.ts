import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("Integration", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Play multiple anthems", async () => {
    let result = await alexa.launch();
    expect(result.response.outputSpeech.ssml).toContain("launch");
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.intend("RandomIntent");
    expect(result.response.outputSpeech.ssml).toContain("play.text");
    expect(result.response.shouldEndSession).toBe(true);

    result = await alexa.intend("PlayAnthemIntent", { country: "any" });
    expect(result.response.outputSpeech.ssml).toContain("play.unknown-country");
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.intend("PlayAnthemIntent", { country: "United States" });
    expect(result.response.outputSpeech.ssml).toContain("play.text");
    expect(result.response.shouldEndSession).toBe(true);
    expect(alexa.audioPlayer().isPlaying()).toBe(true);

    result = await alexa.utter("next");
    expect(result.response.outputSpeech.ssml).toContain("play.text");
    expect(result.response.shouldEndSession).toBe(true);
    expect(alexa.audioPlayer().isPlaying()).toBe(true);

    result = await alexa.utter("pause");
    expect(alexa.audioPlayer().isPlaying()).toBe(false);

    result = await alexa.utter("continue");
    expect(alexa.audioPlayer().isPlaying()).toBe(true);

    result = await alexa.utter("stop");
    expect(alexa.audioPlayer().isPlaying()).toBe(false);
    expect(result.response.outputSpeech.ssml).toContain("stop");
    expect(result.response.shouldEndSession).toBe(true);
  });
});

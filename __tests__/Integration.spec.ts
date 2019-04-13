import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("Integration", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
  });

  describe("Without AudioPlayer", () => {
    beforeEach(() => {
      alexa.context().device().audioPlayerSupported(false);
    });

    test("Play multiple anthems", async () => {
      let result = await alexa.launch();
      expect(result.response.outputSpeech.ssml).toContain("Which national anthem do you want to play?");
      expect(result.response.shouldEndSession).toBe(false);

      result = await alexa.intend("PlayAnthemIntent", { country: "any" });
      expect(result.response.outputSpeech.ssml).toContain("I don't know the national anthem of any.");
      expect(result.response.shouldEndSession).toBe(false);

      result = await alexa.intend("PlayAnthemIntent", { country: "United States" });
      expect(result.response.outputSpeech.ssml).toContain("Here's the national anthem of United States.");
      expect(result.response.shouldEndSession).toBe(false);

      result = await alexa.intend("PlayAnthemIntent", { country: "spanish" });
      expect(result.response.outputSpeech.ssml).toContain("Here's the national anthem of Spain.");
      expect(result.response.shouldEndSession).toBe(false);

      result = await alexa.utter("stop");
      expect(result.response.outputSpeech.ssml).toContain("Goodbye!");
      expect(result.response.shouldEndSession).toBe(true);
    });
  });

  describe("With AudioPlayer", () => {
    beforeEach(() => {
      alexa.context().device().audioPlayerSupported(true);
    });

    test("Play multiple anthems", async () => {
      let result = await alexa.launch();
      expect(result.response.outputSpeech.ssml).toContain("Which national anthem do you want to play?");
      expect(result.response.shouldEndSession).toBe(false);

      result = await alexa.intend("PlayAnthemIntent", { country: "any" });
      expect(result.response.outputSpeech.ssml).toContain("I don't know the national anthem of any.");
      expect(result.response.shouldEndSession).toBe(false);

      result = await alexa.intend("PlayAnthemIntent", { country: "United States" });
      expect(result.response.outputSpeech.ssml).toContain("Here's the national anthem of United States.");
      expect(result.response.shouldEndSession).toBe(true);
      expect(alexa.audioPlayer().isPlaying()).toBe(true);

      result = await alexa.utter("next");
      expect(result.response.outputSpeech.ssml).toContain("Here's the national anthem of");
      expect(result.response.shouldEndSession).toBe(true);
      expect(alexa.audioPlayer().isPlaying()).toBe(true);

      result = await alexa.utter("pause");
      expect(alexa.audioPlayer().isPlaying()).toBe(false);

      result = await alexa.utter("continue");
      expect(alexa.audioPlayer().isPlaying()).toBe(true);

      result = await alexa.utter("stop");
      expect(alexa.audioPlayer().isPlaying()).toBe(false);
      expect(result.response.outputSpeech.ssml).toContain("Goodbye!");
      expect(result.response.shouldEndSession).toBe(true);
    });
  });
});

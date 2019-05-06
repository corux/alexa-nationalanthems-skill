import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("AMAZON.LoopOnIntent and AMAZON.LoopOffIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Should remember loop mode, before playback is started", async () => {
    let result = await alexa.request()
      .intent("AMAZON.LoopOnIntent").send();

    expect(result.response.outputSpeech.ssml).toContain("audio.loop-on-prepare");
    expect(result.sessionAttributes.loopMode).toBe(true);
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.request()
      .intent("PlayAnthemIntent").slot("country", "United States").send();
    expect(result.response.directives[0].audioItem.stream.token).toBe("USA:1:0");
  });

  test("Should allow changing loop mode, before playback is started", async () => {
    let result = await alexa.request()
      .intent("AMAZON.LoopOnIntent").send();

    expect(result.response.outputSpeech.ssml).toContain("audio.loop-on-prepare");
    expect(result.sessionAttributes.loopMode).toBe(true);
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.request()
      .intent("AMAZON.LoopOffIntent").send();

    expect(result.response.outputSpeech.ssml).toContain("audio.loop-off");
    expect(result.sessionAttributes.loopMode).toBe(false);
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.request()
      .intent("PlayAnthemIntent").slot("country", "United States").send();
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe("USA:0:0");
  });

  test("Should allow activating loop mode during playback", async () => {
    let result = await alexa.request()
      .intent("PlayAnthemIntent").slot("country", "Germany").send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe("DEU:0:0");

    result = await alexa.request()
      .intent("AMAZON.LoopOnIntent").send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.response.outputSpeech.ssml).toContain("audio.loop-on");
    expect(result.directive("AudioPlayer.Play").playBehavior).toBe("REPLACE_ENQUEUED");
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe("DEU:1:0");
  });

  test("Should allow deactivating loop mode during playback", async () => {
    let result = await alexa.request()
      .intent("AMAZON.LoopOnIntent").send();

    result = await alexa.request()
      .intent("PlayAnthemIntent").slot("country", "Germany").send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe("DEU:1:0");

    result = await alexa.request()
      .intent("AMAZON.LoopOffIntent").send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.response.outputSpeech.ssml).toContain("audio.loop-off");
    expect(result.directive("AudioPlayer.ClearQueue").clearBehavior).toBe("CLEAR_ENQUEUED");
  });

  test("Should loop current anthem", async () => {
    const result = await alexa.request()
      .audioPlayer("AudioPlayer.PlaybackNearlyFinished", "DEU:1:0", 0).send();
    console.warn(result.response);
    expect(result.directive("AudioPlayer.Play").playBehavior).toBe("REPLACE_ENQUEUED");
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe("DEU:1:0");
  });
});

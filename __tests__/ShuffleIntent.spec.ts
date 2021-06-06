import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("AMAZON.ShuffleOnIntent and AMAZON.ShuffleOffIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Should remember shuffle mode, before playback is started", async () => {
    let result = await alexa.request().intent("AMAZON.ShuffleOnIntent").send();

    expect(result.response.outputSpeech.ssml).toContain("audio.shuffle-on");
    expect(result.sessionAttributes.shuffleMode).toBe(true);
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa
      .request()
      .intent("PlayAnthemIntent")
      .slot("country", "United States")
      .send();
    expect(result.response.directives[0].audioItem.stream.token).toBe(
      "USA:0:1"
    );
  });

  test("Should allow changing shuffle mode, before playback is started", async () => {
    let result = await alexa.request().intent("AMAZON.ShuffleOnIntent").send();

    expect(result.response.outputSpeech.ssml).toContain("audio.shuffle-on");
    expect(result.sessionAttributes.shuffleMode).toBe(true);
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.request().intent("AMAZON.ShuffleOffIntent").send();

    expect(result.response.outputSpeech.ssml).toContain("audio.shuffle-off");
    expect(result.sessionAttributes.shuffleMode).toBe(false);
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa
      .request()
      .intent("PlayAnthemIntent")
      .slot("country", "United States")
      .send();
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe(
      "USA:0:0"
    );
  });

  test("Should allow activating shuffle mode during playback", async () => {
    let result = await alexa
      .request()
      .intent("PlayAnthemIntent")
      .slot("country", "Germany")
      .send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe(
      "DEU:0:0"
    );

    result = await alexa.request().intent("AMAZON.ShuffleOnIntent").send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.response.outputSpeech.ssml).toContain("audio.shuffle-on");
    expect(result.directive("AudioPlayer.Play").playBehavior).toBe(
      "REPLACE_ALL"
    );
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe(
      "DEU:0:1"
    );
  });

  test("Should allow deactivating shuffle mode during playback", async () => {
    let result = await alexa.request().intent("AMAZON.ShuffleOnIntent").send();

    result = await alexa
      .request()
      .intent("PlayAnthemIntent")
      .slot("country", "Germany")
      .send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe(
      "DEU:0:1"
    );

    result = await alexa.request().intent("AMAZON.ShuffleOffIntent").send();

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.response.outputSpeech.ssml).toContain("audio.shuffle-off");
    expect(result.directive("AudioPlayer.Play").playBehavior).toBe(
      "REPLACE_ALL"
    );
    expect(result.directive("AudioPlayer.Play").audioItem.stream.token).toBe(
      "DEU:0:0"
    );
  });

  test("Should shuffle random anthems", async () => {
    const result = await alexa
      .request()
      .audioPlayer("AudioPlayer.PlaybackNearlyFinished", "DEU:0:1", 0)
      .send();
    console.warn(result.response);
    expect(result.directive("AudioPlayer.Play").playBehavior).toBe(
      "REPLACE_ENQUEUED"
    );
    expect(
      result.directive("AudioPlayer.Play").audioItem.stream.token
    ).toContain(":0:1");
  });
});

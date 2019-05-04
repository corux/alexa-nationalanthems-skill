import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("PlayAnthemIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Should ask for anthem if no country was provided", async () => {
    const result = await alexa.intend("PlayAnthemIntent");

    expect(result.response.outputSpeech.ssml).toContain("launch");
    expect(result.response.shouldEndSession).toBe(false);
  });

  // Disabled, because anthems for all countries are available
  xtest("Should tell if anthem of selected country is unavailable", async () => {
    const result = await alexa.intend("PlayAnthemIntent", {
      country: "South Ossetia",
    });

    expect(result.response.outputSpeech.ssml).toContain("play.unknown-country");
    expect(result.response.shouldEndSession).toBe(false);
  });

  test("Should play anthem for country with available anthem", async () => {
    const result = await alexa.intend("PlayAnthemIntent", {
      country: "Germany",
    });

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.response.outputSpeech.ssml).toContain("play.text");
    expect(result.response.directives[0].audioItem.stream.url).toContain("/mp3s-full/DEU.mp3");
    expect(result.response.directives[0].audioItem.stream.token).toBe("DEU");
  });

  test("Should play anthem from extended dataset", async () => {
    const result = await alexa.intend("PlayAnthemIntent", {
      country: "Europe",
    });

    expect(alexa.audioPlayer().isPlaying()).toBe(true);
    expect(result.response.outputSpeech.ssml).toContain("play.text");
    expect(result.response.directives[0].audioItem.stream.url).toContain("/mp3s-full/EUROPE.mp3");
    expect(result.response.directives[0].audioItem.stream.token).toBe("EUROPE");
  });
});

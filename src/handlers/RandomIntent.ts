import { BaseRequestHandler, IExtendedHandlerInput, Intents, Request } from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";
import { getAnthemUrl, getRandomCountry } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Request("PlaybackController.NextCommandIssued")
@Intents("AMAZON.NextIntent", "SkipIntent")
export class RandomHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const t = handlerInput.t;

    const currentAudio = parseAudioToken(handlerInput);
    const country = getRandomCountry(null, handlerInput.getLocale());
    const token = createAudioToken(country,
      currentAudio && currentAudio.loopMode,
      currentAudio && currentAudio.shuffleMode);

    return handlerInput.getResponseBuilder()
      .speakIfSupported(t("play.text", country.name))
      .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(country, true),
        token, 0, undefined, getAudioPlayerMetadata(country))
      .withShouldEndSession(true)
      .getResponse();
  }
}

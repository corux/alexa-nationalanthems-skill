import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {
  BaseIntentHandler, getAnthemUrl, getLocale,
  getRandomCountry, getResponseBuilder, Intents, Request,
} from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Request("PlaybackController.NextCommandIssued")
@Intents("AMAZON.NextIntent", "SkipIntent")
export class RandomHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const locale = getLocale(handlerInput);
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    const currentAudio = parseAudioToken(handlerInput);
    const country = getRandomCountry(null, locale);
    const token = createAudioToken(country,
      currentAudio && currentAudio.loopMode,
      currentAudio && currentAudio.shuffleMode);

    return getResponseBuilder(handlerInput)
      .speakIfSupported(t("play.text", country.name))
      .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(country, true),
        token, 0, undefined, getAudioPlayerMetadata(country))
      .withShouldEndSession(true)
      .getResponse();
  }
}

import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import countries from "../data/countries";
import { BaseIntentHandler, getAnthemUrl, getLocale, Intents, supportsAudioPlayer } from "../utils";
import { getAudioPlayerMetadata, getCountryFromAudioPlayer } from "./PlayAnthemIntent";

@Intents("AMAZON.ResumeIntent")
export class AmazonResumeIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = getLocale(handlerInput);

    const countryFromAudioPlayer = getCountryFromAudioPlayer(handlerInput);
    if (supportsAudioPlayer(handlerInput) && countryFromAudioPlayer) {
      const offset = Math.max(handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds - 1000, 0);
      return responseBuilder
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(countryFromAudioPlayer, true),
          countryFromAudioPlayer.iso3, offset, undefined, getAudioPlayerMetadata(countryFromAudioPlayer))
        .withShouldEndSession(true)
        .getResponse();
    }

    if (session.iso) {
      const country = countries.getByIso3(session.iso, locale);
      return responseBuilder
        .speak(`<audio src="${getAnthemUrl(country)}" /> ${t("play.reprompt")}`)
        .reprompt(t("play.reprompt"))
        .getResponse();
    }

    return responseBuilder
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

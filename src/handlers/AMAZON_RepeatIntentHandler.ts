import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, Intents } from "../utils";
import { getAudioPlayerMetadata, getCountryFromAudioPlayer } from "./PlayAnthemIntent";

@Intents("AMAZON.RepeatIntent", "AMAZON.StartOverIntent")
export class AmazonRepeatIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    const countryFromAudioPlayer = getCountryFromAudioPlayer(handlerInput);
    if (countryFromAudioPlayer) {
      return responseBuilder
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(countryFromAudioPlayer, true),
          countryFromAudioPlayer.iso3, 0, undefined, getAudioPlayerMetadata(countryFromAudioPlayer))
        .withShouldEndSession(true)
        .getResponse();
    }

    return responseBuilder
      .speak(`${t("play.no-repeat")} ${t("play.reprompt")}`)
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

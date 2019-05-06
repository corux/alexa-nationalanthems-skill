import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";
import { getCountryFromAudioPlayer } from "./PlayAnthemIntent";

@Intents("AMAZON.PreviousIntent",
  "AMAZON.ShuffleOffIntent",
  "AMAZON.ShuffleOnIntent")
export class UnsupportedHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    if (getCountryFromAudioPlayer(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(t("unsupported"))
        .withShouldEndSession(true)
        .getResponse();
    }

    const reprompt = t("play.reprompt");
    return handlerInput.responseBuilder
      .speak(`${t("unsupported")} ${reprompt}`)
      .reprompt(reprompt)
      .getResponse();
  }
}

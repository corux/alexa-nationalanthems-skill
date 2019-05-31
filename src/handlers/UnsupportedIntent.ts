import { BaseRequestHandler, IExtendedHandlerInput, Intents } from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";
import { getCountryFromAudioPlayer } from "./PlayAnthemIntent";

@Intents("AMAZON.PreviousIntent")
export class UnsupportedHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const t = handlerInput.t;

    if (getCountryFromAudioPlayer(handlerInput)) {
      return handlerInput.getResponseBuilder()
        .speak(t("unsupported"))
        .withShouldEndSession(true)
        .getResponse();
    }

    const reprompt = t("play.reprompt");
    return handlerInput.getResponseBuilder()
      .speak(`${t("unsupported")} ${reprompt}`)
      .reprompt(reprompt)
      .getResponse();
  }
}

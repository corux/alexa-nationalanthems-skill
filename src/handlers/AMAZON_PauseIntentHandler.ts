import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents, supportsAudioPlayer } from "../utils";

@Intents("AMAZON.PauseIntent")
export class AmazonPauseIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    if (supportsAudioPlayer(handlerInput)) {
      return handlerInput.responseBuilder
        .addAudioPlayerStopDirective()
        .withShouldEndSession(true)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(t("stop"))
      .withShouldEndSession(true)
      .getResponse();
  }
}

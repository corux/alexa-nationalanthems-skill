import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getResponseBuilder, Intents, supportsAudioPlayer } from "../utils";

@Intents("AMAZON.CancelIntent", "AMAZON.StopIntent")
export class AmazonCancelAndStopIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return getResponseBuilder(handlerInput)
      .if(supportsAudioPlayer(handlerInput), (builder) => {
        builder.addAudioPlayerStopDirective();
      })
      .speak(t("stop"))
      .withShouldEndSession(true)
      .getResponse();
  }
}

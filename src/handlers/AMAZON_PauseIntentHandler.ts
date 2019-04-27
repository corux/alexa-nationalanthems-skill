import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents, Request } from "../utils";

@Request("PlaybackController.PauseCommandIssued")
@Intents("AMAZON.PauseIntent")
export class AmazonPauseIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();
  }
}

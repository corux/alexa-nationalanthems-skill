import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Intents,
  Request,
} from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";

@Request("PlaybackController.PauseCommandIssued")
@Intents("AMAZON.PauseIntent")
export class AmazonPauseIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();
  }
}

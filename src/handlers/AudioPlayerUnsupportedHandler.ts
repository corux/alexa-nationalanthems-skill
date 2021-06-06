import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Request,
} from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";

@Request(
  "AudioPlayer.PlaybackStarted",
  "AudioPlayer.PlaybackFinished",
  "AudioPlayer.PlaybackStopped",
  "AudioPlayer.PlaybackFailed"
)
export class AudioPlayerUnsupportedHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    return handlerInput.getResponseBuilder().getResponse();
  }
}

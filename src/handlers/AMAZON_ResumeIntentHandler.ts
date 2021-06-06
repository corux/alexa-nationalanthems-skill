import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Intents,
  Request,
} from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";
import { getAnthemUrl } from "../utils";
import {
  createAudioToken,
  getAudioPlayerMetadata,
  parseAudioToken,
} from "./PlayAnthemIntent";

@Request("PlaybackController.PlayCommandIssued")
@Intents("AMAZON.ResumeIntent")
export class AmazonResumeIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const currentAudio = parseAudioToken(handlerInput);
    if (currentAudio) {
      let offset =
        handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
      if (
        handlerInput.requestEnvelope.context.AudioPlayer.playerActivity ===
        "FINISHED"
      ) {
        offset = 0;
      }
      const token = createAudioToken(
        currentAudio.country,
        currentAudio.loopMode,
        currentAudio.shuffleMode
      );
      return handlerInput
        .getResponseBuilder()
        .addAudioPlayerPlayDirective(
          "REPLACE_ALL",
          getAnthemUrl(currentAudio.country, true),
          token,
          offset,
          undefined,
          getAudioPlayerMetadata(currentAudio.country)
        )
        .withShouldEndSession(true)
        .getResponse();
    }

    const t = handlerInput.t;

    return handlerInput
      .getResponseBuilder()
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

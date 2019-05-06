import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, Intents, Request } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Request("PlaybackController.PlayCommandIssued")
@Intents("AMAZON.ResumeIntent")
export class AmazonResumeIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;

    const currentAudio = parseAudioToken(handlerInput);
    if (currentAudio) {
      let offset = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
      if (handlerInput.requestEnvelope.context.AudioPlayer.playerActivity === "FINISHED") {
        offset = 0;
      }
      const token = createAudioToken(currentAudio.country, currentAudio.loopMode, currentAudio.shuffleMode);
      return responseBuilder
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(currentAudio.country, true),
          token, offset, undefined, getAudioPlayerMetadata(currentAudio.country))
        .withShouldEndSession(true)
        .getResponse();
    }

    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return responseBuilder
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

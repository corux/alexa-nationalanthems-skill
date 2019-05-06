import { HandlerInput } from "ask-sdk-core";
import { interfaces, Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, getLocale, getRandomCountry, getResponseBuilder, Request } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Request("AudioPlayer.PlaybackNearlyFinished")
export class AudioPlayerPlaybackHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const currentAudio = parseAudioToken(handlerInput,
      (handlerInput.requestEnvelope.request as interfaces.audioplayer.PlaybackNearlyFinishedRequest).token);
    const responseBuilder = getResponseBuilder(handlerInput);

    if (currentAudio) {
      if (currentAudio.loopMode) {
        return responseBuilder
          .addAudioPlayerPlayDirective("REPLACE_ENQUEUED", getAnthemUrl(currentAudio.country, true),
            createAudioToken(currentAudio.country, true), 0, undefined, getAudioPlayerMetadata(currentAudio.country))
          .getResponse();
      }

      if (currentAudio.shuffleMode) {
        const locale = getLocale(handlerInput);
        const country = getRandomCountry(null, locale);
        const token = createAudioToken(country, false, true);

        return responseBuilder
          .addAudioPlayerPlayDirective("REPLACE_ENQUEUED", getAnthemUrl(currentAudio.country, true),
            token, 0, undefined, getAudioPlayerMetadata(currentAudio.country))
          .getResponse();
      }
    }

    return responseBuilder.getResponse();
  }
}

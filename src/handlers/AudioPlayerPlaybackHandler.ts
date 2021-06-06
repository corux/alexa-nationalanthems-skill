import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Request,
} from "@corux/ask-extensions";
import { interfaces, Response } from "ask-sdk-model";
import { getAnthemUrl, getRandomCountry } from "../utils";
import {
  createAudioToken,
  getAudioPlayerMetadata,
  parseAudioToken,
} from "./PlayAnthemIntent";

@Request("AudioPlayer.PlaybackNearlyFinished")
export class AudioPlayerPlaybackHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const currentAudio = parseAudioToken(
      handlerInput,
      (
        handlerInput.requestEnvelope
          .request as interfaces.audioplayer.PlaybackNearlyFinishedRequest
      ).token
    );
    const responseBuilder = handlerInput.getResponseBuilder();

    if (currentAudio) {
      if (currentAudio.loopMode) {
        return responseBuilder
          .addAudioPlayerPlayDirective(
            "REPLACE_ENQUEUED",
            getAnthemUrl(currentAudio.country, true),
            createAudioToken(currentAudio.country, true),
            0,
            undefined,
            getAudioPlayerMetadata(currentAudio.country)
          )
          .getResponse();
      }

      if (currentAudio.shuffleMode) {
        const randomCountry = getRandomCountry(null, handlerInput.getLocale());

        return responseBuilder
          .addAudioPlayerPlayDirective(
            "REPLACE_ENQUEUED",
            getAnthemUrl(randomCountry, true),
            createAudioToken(randomCountry, false, true),
            0,
            undefined,
            getAudioPlayerMetadata(randomCountry)
          )
          .getResponse();
      }
    }

    return responseBuilder.getResponse();
  }
}

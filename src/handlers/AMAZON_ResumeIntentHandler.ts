import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, Intents, Request } from "../utils";
import { getAudioPlayerMetadata, getCountryFromAudioPlayer } from "./PlayAnthemIntent";

@Request("PlaybackController.PlayCommandIssued")
@Intents("AMAZON.ResumeIntent")
export class AmazonResumeIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;

    const countryFromAudioPlayer = getCountryFromAudioPlayer(handlerInput);
    if (countryFromAudioPlayer) {
      let offset = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
      if (handlerInput.requestEnvelope.context.AudioPlayer.playerActivity === "FINISHED") {
        offset = 0;
      }
      return responseBuilder
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(countryFromAudioPlayer, true),
          countryFromAudioPlayer.iso3, offset, undefined, getAudioPlayerMetadata(countryFromAudioPlayer))
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

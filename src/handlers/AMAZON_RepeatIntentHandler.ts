import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, Intents } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Intents("AMAZON.RepeatIntent", "AMAZON.StartOverIntent")
export class AmazonRepeatIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    const currentAudio = parseAudioToken(handlerInput);
    if (currentAudio) {
      const token = createAudioToken(currentAudio.country, currentAudio.loopMode, currentAudio.shuffleMode);
      return responseBuilder
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(currentAudio.country, true),
          token, 0, undefined, getAudioPlayerMetadata(currentAudio.country))
        .withShouldEndSession(true)
        .getResponse();
    }

    return responseBuilder
      .speak(`${t("play.no-repeat")} ${t("play.reprompt")}`)
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

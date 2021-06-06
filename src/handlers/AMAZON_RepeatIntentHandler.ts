import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Intents,
} from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";
import { getAnthemUrl } from "../utils";
import {
  createAudioToken,
  getAudioPlayerMetadata,
  parseAudioToken,
} from "./PlayAnthemIntent";

@Intents("AMAZON.RepeatIntent", "AMAZON.StartOverIntent")
export class AmazonRepeatIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const t = handlerInput.t;

    const currentAudio = parseAudioToken(handlerInput);
    if (currentAudio) {
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
          0,
          undefined,
          getAudioPlayerMetadata(currentAudio.country)
        )
        .withShouldEndSession(true)
        .getResponse();
    }

    return handlerInput
      .getResponseBuilder()
      .speak(`${t("play.no-repeat")} ${t("play.reprompt")}`)
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

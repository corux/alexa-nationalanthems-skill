import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, getResponseBuilder, Intents } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Intents("AMAZON.ShuffleOffIntent", "AMAZON.ShuffleOnIntent")
export class AmazonShuffleIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const isShuffleOnIntent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent.name === "AMAZON.ShuffleOnIntent";

    const currentAudio = parseAudioToken(handlerInput);
    if (!currentAudio) {
      const session = handlerInput.attributesManager.getSessionAttributes();
      session.shuffleMode = isShuffleOnIntent;

      return getResponseBuilder(handlerInput)
        .if(isShuffleOnIntent, (builder) => builder.speak(`${t("audio.shuffle-on-prepare")} ${t("help.reprompt")}`))
        .if(!isShuffleOnIntent, (builder) => builder.speak(`${t("audio.shuffle-off")} ${t("help.reprompt")}`))
        .reprompt(t("help.reprompt"))
        .getResponse();
    }

    const offset = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
    return getResponseBuilder(handlerInput)
      .if(isShuffleOnIntent, (builder) => builder.speak(t("audio.shuffle-on")))
      .if(!isShuffleOnIntent, (builder) => builder.speak(t("audio.shuffle-off")))
      .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(currentAudio.country, true),
        createAudioToken(currentAudio.country, false, isShuffleOnIntent), offset,
        undefined, getAudioPlayerMetadata(currentAudio.country))
      .withShouldEndSession(true)
      .getResponse();
  }
}

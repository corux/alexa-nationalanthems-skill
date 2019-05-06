import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, getResponseBuilder, Intents } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Intents("AMAZON.LoopOffIntent", "AMAZON.LoopOnIntent")
export class AmazonLoopIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const isLoopOnIntent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent.name === "AMAZON.LoopOnIntent";

    const currentAudio = parseAudioToken(handlerInput);
    if (!currentAudio) {
      const session = handlerInput.attributesManager.getSessionAttributes();
      session.loopMode = isLoopOnIntent;

      return getResponseBuilder(handlerInput)
        .if(isLoopOnIntent, (builder) => builder.speak(`${t("audio.loop-on-prepare")} ${t("help.reprompt")}`))
        .if(!isLoopOnIntent, (builder) => builder.speak(`${t("audio.loop-off")} ${t("help.reprompt")}`))
        .reprompt(t("help.reprompt"))
        .getResponse();
    }

    if (isLoopOnIntent) {
      return getResponseBuilder(handlerInput)
        .speak(t("audio.loop-on", currentAudio.country.name))
        .addAudioPlayerPlayDirective("REPLACE_ENQUEUED", getAnthemUrl(currentAudio.country, true),
          createAudioToken(currentAudio.country, true), 0, undefined, getAudioPlayerMetadata(currentAudio.country))
        .withShouldEndSession(true)
        .getResponse();
    }

    return getResponseBuilder(handlerInput)
      .speak(t("audio.loop-off"))
      .addAudioPlayerClearQueueDirective("CLEAR_ENQUEUED")
      .withShouldEndSession(true)
      .getResponse();
  }
}

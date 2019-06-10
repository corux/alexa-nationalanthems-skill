import { BaseRequestHandler, IExtendedHandlerInput, Intents } from "@corux/ask-extensions";
import { IntentRequest, Response } from "ask-sdk-model";
import { getAnthemUrl, getTArgument } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Intents("AMAZON.LoopOffIntent", "AMAZON.LoopOnIntent")
export class AmazonLoopIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const t = handlerInput.t;
    const isLoopOnIntent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent.name === "AMAZON.LoopOnIntent";

    const currentAudio = parseAudioToken(handlerInput);
    if (!currentAudio) {
      const session = handlerInput.attributesManager.getSessionAttributes();
      session.loopMode = isLoopOnIntent;

      return handlerInput.getResponseBuilder()
        .if(isLoopOnIntent, (builder) => builder.speak(`${t("audio.loop-on-prepare")} ${t("help.reprompt")}`))
        .if(!isLoopOnIntent, (builder) => builder.speak(`${t("audio.loop-off")} ${t("help.reprompt")}`))
        .reprompt(t("help.reprompt"))
        .getResponse();
    }

    const offset = handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
    return handlerInput.getResponseBuilder()
      .if(isLoopOnIntent, (builder) =>
        builder.speak(t("audio.loop-on", getTArgument(currentAudio.country, handlerInput.getLocale()))))
      .if(!isLoopOnIntent, (builder) => builder.speak(t("audio.loop-off")))
      .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(currentAudio.country, true),
        createAudioToken(currentAudio.country, isLoopOnIntent), offset,
        undefined, getAudioPlayerMetadata(currentAudio.country))
      .withShouldEndSession(true)
      .getResponse();
  }
}

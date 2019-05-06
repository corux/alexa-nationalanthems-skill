import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, getLocale, getRandomCountry, getResponseBuilder, Intents } from "../utils";
import { createAudioToken, getAudioPlayerMetadata, parseAudioToken } from "./PlayAnthemIntent";

@Intents("AMAZON.ShuffleOffIntent", "AMAZON.ShuffleOnIntent")
export class AmazonShuffleIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const locale = getLocale(handlerInput);
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

    if (isShuffleOnIntent) {
      const country = getRandomCountry(null, locale);
      const token = createAudioToken(country, false, true);
      return getResponseBuilder(handlerInput)
        .speak(t("audio.shuffle-on", currentAudio.country.name))
        .addAudioPlayerPlayDirective("REPLACE_ENQUEUED", getAnthemUrl(currentAudio.country, true),
          token, 0, undefined, getAudioPlayerMetadata(currentAudio.country))
        .withShouldEndSession(true)
        .getResponse();
    }

    return getResponseBuilder(handlerInput)
      .speak(t("audio.shuffle-off"))
      .addAudioPlayerClearQueueDirective("CLEAR_ENQUEUED")
      .withShouldEndSession(true)
      .getResponse();
  }
}

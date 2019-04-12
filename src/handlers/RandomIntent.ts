import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {
  BaseIntentHandler, getAnthemUrl, getLocale,
  getRandomCountry, getResponseBuilder, Intents, supportsAudioPlayer,
} from "../utils";
import { getPlayRenderTemplate } from "./PlayAnthemIntent";

@Intents("AMAZON.NextIntent", "SkipIntent")
export class RandomHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = getLocale(handlerInput);

    const country = getRandomCountry(null, locale);
    session.iso = country.iso3;

    if (supportsAudioPlayer(handlerInput)) {
      return getResponseBuilder(handlerInput)
        .speak(`${t("play.random")} ${t("play.text", country.name)}`)
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(country, true), country.iso3, 0, undefined, {
          title: `${country.name}: ${country.anthemName}`,
        })
        .withShouldEndSession(true)
        .getResponse();
    }

    return getResponseBuilder(handlerInput)
      .addRenderTemplateDirectiveIfSupported(getPlayRenderTemplate(country))
      .speak(`${t("play.random")}
        ${t("play.text", country.name)}
        <audio src="${getAnthemUrl(country)}" />
        ${t("play.reprompt")}`)
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

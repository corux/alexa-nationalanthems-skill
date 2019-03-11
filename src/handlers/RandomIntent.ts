import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getAnthemUrl, getLocale, getRandomCountry, getResponseBuilder, Intents } from "../utils";
import { getPlayRenderTemplate } from "./PlayAnthemIntent";

@Intents("AMAZON.NextIntent", "SkipIntent")
export class RandomHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = getLocale(handlerInput);

    const country = getRandomCountry(null, locale);

    session.iso = country.iso3;
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

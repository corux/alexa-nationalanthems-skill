import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getAnthemUrl, getLocale, getRandomCountry, getResponseBuilder } from "../utils";
import { getPlayRenderTemplate } from "./PlayAnthemIntent";

export class RandomHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest"
      && (request.intent.name === "AMAZON.NextIntent" || request.intent.name === "SkipIntent");
  }

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

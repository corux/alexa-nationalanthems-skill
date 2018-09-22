import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getAnthemUrl, getRandomCountry } from "../utils";

export class RandomHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    const session = handlerInput.attributesManager.getSessionAttributes();
    return request.type === "IntentRequest"
      && (request.intent.name === "AMAZON.NextIntent" || request.intent.name === "SkipIntent")
      && !session.quizMode;
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = handlerInput.requestEnvelope.request.locale;

    const country = getRandomCountry(null, locale);

    session.iso = country.iso3;
    return responseBuilder
      .speak(`${t("play.random")}
        ${t("play.text", country.name)}
        <audio src="${getAnthemUrl(country)}" />
        ${t("play.reprompt")}`)
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

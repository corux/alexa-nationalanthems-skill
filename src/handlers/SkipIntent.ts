import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl, getRandomCountry } from "../utils";

export class SkipHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    const session = handlerInput.attributesManager.getSessionAttributes();
    return request.type === "IntentRequest"
      && (request.intent.name === "AMAZON.NextIntent" || request.intent.name === "SkipIntent")
      && session.quizMode;
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = handlerInput.requestEnvelope.request.locale;

    const country = getRandomCountry(session.continent, locale);
    const expectedAnswer = countries.getByIso3(session.iso, locale);

    session.iso = country.iso3;
    session.try = 0;
    return responseBuilder
      .speak(`${t("quiz.answer.skip", expectedAnswer.name)}
        <audio src="${getAnthemUrl(country)}" />
        ${t("quiz.reprompt")}`)
      .reprompt(t("quiz.reprompt"))
      .getResponse();
  }
}

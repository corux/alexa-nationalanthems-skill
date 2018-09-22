import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl, getRandomCountry, getSlotValue } from "../utils";

export class QuizAnswerHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    const session = handlerInput.attributesManager.getSessionAttributes();
    return request.type === "IntentRequest"
      && (request.intent.name === "PlayAnthemIntent" || request.intent.name === "CountryIntent")
      && session.quizMode;
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = handlerInput.requestEnvelope.request.locale;

    const answer = getSlotValue(intent.slots.country);
    const expectedAnswer = countries.getByIso3(session.iso, locale).name;
    if (answer && answer.toUpperCase() === expectedAnswer.toUpperCase()) {
      const nextCountry = getRandomCountry(session.continent, locale);
      session.iso = nextCountry.iso3;
      session.try = 0;
      return responseBuilder
        .speak(`${t("quiz.answer.correct")}
            <audio src="${getAnthemUrl(nextCountry)}" />
            ${t("quiz.reprompt")}`)
        .reprompt(t("quiz.reprompt"))
        .getResponse();
    }

    session.try++;
    if (session.try >= 3) {
      const nextCountry = getRandomCountry(session.continent, locale);
      session.iso = nextCountry.iso3;
      session.try = 0;
      return responseBuilder
        .speak(`${t("quiz.answer.incorrect-with-solution", expectedAnswer)}
          <audio src="${getAnthemUrl(nextCountry)}" />
          ${t("quiz.reprompt")}`)
        .reprompt(t("quiz.reprompt"))
        .getResponse();
    }

    return responseBuilder
      .speak(t("quiz.answer.incorrect"))
      .reprompt(t("quiz.reprompt"))
      .getResponse();
  }
}

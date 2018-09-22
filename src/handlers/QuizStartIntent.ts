import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { getAnthemUrl, getRandomCountry, getResponseBuilder, getSlotValue } from "../utils";
import { getLaunchTemplate } from "./LaunchRequestHandler";

export class QuizStartHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "QuizIntent";
  }

  public handle(handlerInput: HandlerInput): Response {
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = handlerInput.requestEnvelope.request.locale;

    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const continent = getSlotValue(intent.slots.continent, false);
    const country = getRandomCountry(continent, locale);

    let text = t("quiz.start.text");
    if (!session.quizMode && continent) {
      text = t("quiz.start.text-with-continent", continent);
    } else if (continent) {
      text = t("quiz.start.with-continent", continent);
    } else if (session.continent) {
      text = t("quiz.start.reset-continent");
    }

    session.quizMode = true;
    session.continent = continent;
    session.try = 0;
    session.iso = country.iso3;

    return getResponseBuilder(handlerInput)
      .addRenderTemplateDirectiveIfSupported(getLaunchTemplate(t("quiz.start.text")))
      .speak(`${text}
        <audio src="${getAnthemUrl(country)}" />
        ${t("quiz.reprompt")}`)
      .reprompt(t("quiz.reprompt"))
      .getResponse();
  }
}

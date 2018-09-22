import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class UnsupportedHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest"
      && ["AMAZON.NoIntent", "AMAZON.YesIntent", "UnsupportedIntent"].indexOf(request.intent.name) !== -1;
  }

  public handle(handlerInput: HandlerInput): Response {
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    const reprompt = session.quizMode ? t("quiz.reprompt") : t("play.reprompt");
    return handlerInput.responseBuilder
      .speak(`${t("unsupported")} ${reprompt}`)
      .reprompt(reprompt)
      .getResponse();
  }
}

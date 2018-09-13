import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getRandomCountry } from "../utils";

export class AmazonHelpIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.HelpIntent";
  }

  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const country = getRandomCountry("europa");

    return handlerInput.responseBuilder
      .speak(t("help.text", country.name))
      .reprompt(t("help.reprompt"))
      .withShouldEndSession(false)
      .getResponse();
  }
}

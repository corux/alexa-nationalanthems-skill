import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class AmazonCancelAndStopIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" &&
      ["AMAZON.CancelIntent", "AMAZON.StopIntent"].indexOf(request.intent.name) !== -1;
  }

  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    return handlerInput.responseBuilder
      .speak(t("stop"))
      .withShouldEndSession(true)
      .getResponse();
  }
}

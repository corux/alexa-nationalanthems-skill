import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class AmazonCancelAndStopIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" || request.intent.name === "AMAZON.StopIntent");
  }

  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .speak("Bis bald!")
      .withShouldEndSession(true)
      .getResponse();
  }
}

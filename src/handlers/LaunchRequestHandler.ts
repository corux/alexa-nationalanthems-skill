import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class LaunchRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const responseBuilder = handlerInput.responseBuilder;
    const text = "Welche Nationalhymne möchtest du abspielen?";
    return responseBuilder
      .speak(text)
      .reprompt(text)
      .getResponse();
  }
}

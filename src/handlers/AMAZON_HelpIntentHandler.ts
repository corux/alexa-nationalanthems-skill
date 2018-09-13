import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getRandomCountry } from "../utils";

export class AmazonHelpIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.HelpIntent";
  }

  public handle(handlerInput: HandlerInput): Response {
    const country = getRandomCountry("europa");

    return handlerInput.responseBuilder
      .speak(`Du kannst dir die Nationalhymnen von verschiedenen Ländern vorspielen lassen.
        Sage zum Beispiel "Spiel die Nationalhymne von ${country.name}.
        Um das Quiz zu starten, sage "Starte das Quiz".
        Was möchtest du als nächstes tun?`)
      .reprompt("Was möchtest du als nächstes tun?")
      .withShouldEndSession(false)
      .getResponse();
  }
}

import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl, getRandomCountry } from "../utils";

export class SkipHandler implements RequestHandler {
  private reprompt = "Zu welchem Land gehörte die gespielte Hymne?";

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

    const country = getRandomCountry(session.continent);
    const expectedAnswer = countries.getByIso3(session.iso);

    session.iso = country.iso3;
    session.try = 0;
    return responseBuilder
      .speak(`Die richtige Antwort war ${expectedAnswer.name}. Hier ist die nächste Hymne:
        <audio src="${getAnthemUrl(country)}" />
        ${this.reprompt}`)
      .reprompt(this.reprompt)
      .getResponse();
  }
}

import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { getAnthemUrl, getRandomCountry, getSlotValue } from "../utils";

export class QuizStartHandler implements RequestHandler {
  private reprompt = "Zu welchem Land gehörte die gespielte Hymne?";

  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "QuizIntent";
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const session = handlerInput.attributesManager.getSessionAttributes();

    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const continent = getSlotValue(intent.slots.continent);
    const country = getRandomCountry(continent);
    session.quizMode = true;
    session.continent = continent;
    session.try = 0;
    session.iso = country.iso3;

    let text = `Willkommen beim Quiz. Versuche die Hymnen den richtigen Ländern zuzuordnen.
      Hier ist die erste Nationalhymne:`;
    if (session && session.quizMode) {
      if (continent) {
        text = `Die Länder wurden auf ${continent} beschränkt. Hier ist die nächste Nationalhymne:`;
      } else if (session.continent) {
        text = "Die Beschränkung der Länder wurde aufgehoben. Hier ist die nächste Nationalhymne:";
      }
    }

    return responseBuilder
      .speak(`${text}
        <audio src="${getAnthemUrl(country)}" />
        ${this.reprompt}`)
      .reprompt(this.reprompt)
      .getResponse();
  }
}

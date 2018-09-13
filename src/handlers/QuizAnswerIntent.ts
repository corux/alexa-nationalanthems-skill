import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl, getRandomCountry, getSlotValue } from "../utils";

export class QuizAnswerHandler implements RequestHandler {
  private reprompt = "Zu welchem Land gehörte die gespielte Hymne?";

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

    const answer = getSlotValue(intent.slots.country);
    const expectedAnswer = countries.getByIso3(session.iso).name;
    if (answer && answer.toUpperCase() === expectedAnswer.toUpperCase()) {
      const nextCountry = getRandomCountry(session.continent);
      session.iso = nextCountry.iso3;
      session.try = 0;
      return responseBuilder
        .speak(`Das war richtig!
            Hier ist die nächste Hymne:
            <audio src="${getAnthemUrl(nextCountry)}" />
            ${this.reprompt}`)
        .reprompt(this.reprompt)
        .getResponse();
    }

    session.try++;
    if (session.try >= 3) {
      const nextCountry = getRandomCountry(session.continent);
      session.iso = nextCountry.iso3;
      session.try = 0;
      return responseBuilder
        .speak(`Das war nicht richtig. Die richtige Antwort war ${expectedAnswer}.
            Hier ist die nächste Hymne:
            <audio src="${getAnthemUrl(nextCountry)}" />
            ${this.reprompt}`)
        .reprompt(this.reprompt)
        .getResponse();
    }

    return responseBuilder
      .speak("Das war nicht richtig. Versuche es noch einmal.")
      .reprompt(this.reprompt)
      .getResponse();
  }
}

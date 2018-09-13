import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl, getSlotValue } from "../utils";

export class PlayAnthemHandler implements RequestHandler {
  private repromptNextAnthem = "Welche Nationalhymne möchtest du als nächstes abspielen?";

  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    const session = handlerInput.attributesManager.getSessionAttributes();
    return request.type === "IntentRequest"
      && (request.intent.name === "PlayAnthemIntent" || request.intent.name === "CountryIntent")
      && !session.quizMode;
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const country = getSlotValue(intent.slots.country);
    if (!country) {
      const text = "Welche Nationalhymne möchtest du abspielen?";
      return responseBuilder
        .speak(text)
        .reprompt(text)
        .getResponse();
    }

    const data = countries.getAll().find((val) => val.name.toUpperCase() === country.toUpperCase());
    if (data && data.anthem) {
      const session = handlerInput.attributesManager.getSessionAttributes();
      session.iso = data.iso3;
      session.quizMode = false;

      return responseBuilder.speak(`Hier ist die Nationalhymne von ${data.name}.
            <audio src="${getAnthemUrl(data)}" />
            ${this.repromptNextAnthem}`)
        .reprompt(this.repromptNextAnthem)
        .getResponse();
    }

    return responseBuilder
      .speak(`Ich kenne die Nationalhymne von ${data ? data.name : country} leider nicht.
        Bitte wähle ein anderes Land.`)
      .reprompt(this.repromptNextAnthem)
      .getResponse();
  }
}

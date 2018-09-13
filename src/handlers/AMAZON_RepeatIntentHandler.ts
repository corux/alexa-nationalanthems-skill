import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl } from "../utils";

export class AmazonRepeatIntentHandler implements RequestHandler {
  private reprompt = "Zu welchem Land gehörte die gespielte Hymne?";
  private repromptNextAnthem = "Welche Nationalhymne möchtest du als nächstes abspielen?";

  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.RepeatIntent";
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const session = handlerInput.attributesManager.getSessionAttributes();

    if (session.quizMode && session.iso) {
      const country = countries.getByIso3(session.iso);
      return responseBuilder
        .speak(`<audio src="${getAnthemUrl(country)}" /> ${this.reprompt}`)
        .reprompt(this.reprompt)
        .getResponse();
    }

    if (session.iso) {
      const country = countries.getByIso3(session.iso);
      return responseBuilder
        .speak(`<audio src="${getAnthemUrl(country)}" /> ${this.repromptNextAnthem}`)
        .reprompt(this.repromptNextAnthem)
        .getResponse();
    }

    return responseBuilder
      .speak(`Es gibt nichts zu wiederholen. ${this.repromptNextAnthem}`)
      .reprompt(this.repromptNextAnthem)
      .getResponse();
  }
}

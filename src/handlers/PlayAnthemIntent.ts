import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import countries from "../countries";
import { getAnthemUrl, getSlotValue } from "../utils";

export class PlayAnthemHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    const session = handlerInput.attributesManager.getSessionAttributes();
    return request.type === "IntentRequest"
      && (request.intent.name === "PlayAnthemIntent" || request.intent.name === "CountryIntent")
      && !session.quizMode;
  }

  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = handlerInput.requestEnvelope.request.locale;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const country = getSlotValue(intent.slots.country);
    if (!country) {
      return responseBuilder
        .speak(t("launch"))
        .reprompt(t("launch"))
        .getResponse();
    }

    const data = countries.getAll(locale).find((val) => val.name.toUpperCase() === country.toUpperCase());
    if (data && data.anthem) {
      const session = handlerInput.attributesManager.getSessionAttributes();
      session.iso = data.iso3;
      session.quizMode = false;

      return responseBuilder.speak(`${t("play.text", data.name)}
            <audio src="${getAnthemUrl(data)}" />
            ${t("play.reprompt")}`)
        .reprompt(t("play.reprompt"))
        .getResponse();
    }

    return responseBuilder
      .speak(t("play.unknown-country", data ? data.name : country))
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

import { Region } from "@corux/country-data";
import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getLocale, getRandomCountry } from "../utils";

export class AmazonHelpIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.HelpIntent";
  }

  public handle(handlerInput: HandlerInput): Response {
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = getLocale(handlerInput);
    const country = getRandomCountry(this.getRegion(locale), locale);

    return handlerInput.responseBuilder
      .speak(`${t("help.text", country.name)} ${t("help.reprompt")}`)
      .reprompt(t("help.reprompt"))
      .withShouldEndSession(false)
      .getResponse();
  }

  private getRegion(locale: Locale): Region {
    switch (locale) {
      case "en-US":
      case "en-CA":
        return Region.NORTH_AMERICA;
      case "es-MX":
        return Region.AMERICAS;
      case "en-IN":
        return Region.ASIA;
      case "en-AU":
        return Region.OCEANIA;
      case "de-DE":
      case "en-GB":
      case "es-ES":
      case "it-IT":
      case "fr-FR":
        return Region.EUROPE;
    }
  }
}

import { ContinentCode } from "@corux/country-data";
import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getLocale, getRandomCountry, Intents } from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseIntentHandler {
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

  private getRegion(locale: Locale): ContinentCode {
    switch (locale) {
      case "en-US":
      case "en-CA":
      case "es-MX":
      case "es-US":
        return ContinentCode.NORTH_AMERICA;
      case "pt-BR":
        return ContinentCode.SOUTH_AMERICA;
      case "en-IN":
        return ContinentCode.ASIA;
      case "en-AU":
        return ContinentCode.OCEANIA;
      case "de-DE":
      case "en-GB":
      case "es-ES":
      case "it-IT":
      case "fr-FR":
        return ContinentCode.EUROPE;
    }
  }
}

import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Intents,
  Locale,
} from "@corux/ask-extensions";
import { ContinentCode } from "@corux/country-data";
import { Response } from "ask-sdk-model";
import { getRandomCountry, getTArgument } from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const t = handlerInput.t;
    const locale = handlerInput.getLocale();
    const country = getRandomCountry(this.getRegion(locale), locale);

    return handlerInput.responseBuilder
      .speak(
        `${t("help.text", getTArgument(country, handlerInput.getLocale()))} ${t(
          "help.reprompt"
        )}`
      )
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

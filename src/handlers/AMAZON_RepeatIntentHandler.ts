import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import countries from "../data/countries";
import { BaseIntentHandler, getAnthemUrl, getLocale, Intents } from "../utils";

@Intents("AMAZON.RepeatIntent")
export class AmazonRepeatIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = handlerInput.responseBuilder;
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = getLocale(handlerInput);

    if (session.iso) {
      const country = countries.getByIso3(session.iso, locale);
      return responseBuilder
        .speak(`<audio src="${getAnthemUrl(country)}" /> ${t("play.reprompt")}`)
        .reprompt(t("play.reprompt"))
        .getResponse();
    }

    return responseBuilder
      .speak(`${t("play.no-repeat")} ${t("play.reprompt")}`)
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

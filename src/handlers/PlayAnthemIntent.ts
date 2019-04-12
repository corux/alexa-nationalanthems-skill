import { ICountry } from "@corux/country-data";
import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, interfaces, Response } from "ask-sdk-model";
import countries from "../data/countries";
import { BaseIntentHandler, getAnthemUrl, getLocale, getResponseBuilder, getSlotValue, Intents } from "../utils";

export function getPlayRenderTemplate(data: ICountry): interfaces.display.Template {
  let title = data.name;
  if (data.anthemName) {
    title = `${title}: ${data.anthemName}`;
  }
  return {
    backButton: "HIDDEN",
    backgroundImage: {
      sources: [
        {
          size: "X_LARGE",
          url: "https://s3-eu-west-1.amazonaws.com/alexa-nationalanthems-skill/background.jpg",
        },
      ],
    },
    image: {
      sources: [
        {
          size: "LARGE",
          url: data.flag.largeImageUrl,
        },
        {
          size: "SMALL",
          url: data.flag.smallImageUrl,
        },
      ],
    },
    title,
    type: "BodyTemplate7",
  };
}

@Intents("PlayAnthemIntent", "CountryIntent")
export class PlayAnthemHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const responseBuilder = getResponseBuilder(handlerInput);
    const t = handlerInput.attributesManager.getRequestAttributes().t;
    const locale = getLocale(handlerInput);
    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const { name: countryName, id: countryId } = { ...getSlotValue(intent.slots.country) };
    if (!countryName) {
      return responseBuilder
        .speak(t("launch"))
        .reprompt(t("launch"))
        .getResponse();
    }

    const data = countries.getAll(locale).find((val) => val.iso3 === countryId)
      || countries.getAll(locale).find((val) => (val.name || "").toUpperCase() === countryName.toUpperCase());
    if (data && data.anthem) {
      const session = handlerInput.attributesManager.getSessionAttributes();
      session.iso = data.iso3;

      return responseBuilder
        .addRenderTemplateDirectiveIfSupported(getPlayRenderTemplate(data))
        .speak(`${t("play.text", data.name)}
          <audio src="${getAnthemUrl(data)}" />
          ${t("play.reprompt")}`)
        .reprompt(t("play.reprompt"))
        .getResponse();
    }

    console.warn({
      data: {
        countryId,
        countryName,
        resolvedCountry: data,
      },
      type: "unknown-country",
    });
    return responseBuilder
      .speak(t("play.unknown-country", data ? data.name : countryName))
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

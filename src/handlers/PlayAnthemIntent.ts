import { ICountry } from "@corux/country-data";
import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, interfaces, Response } from "ask-sdk-model";
import countries from "../data/countries";
import { BaseIntentHandler, getAnthemUrl, getLocale, getResponseBuilder, getSlotValue, Intents } from "../utils";

export function getCountryFromAudioPlayer(handlerInput: HandlerInput): ICountry {
  if (handlerInput.requestEnvelope.context.AudioPlayer) {
    const locale = getLocale(handlerInput);
    const iso = handlerInput.requestEnvelope.context.AudioPlayer.token;
    const country = countries.getByIso3(iso, locale);
    return country;
  }

  return undefined;
}

export function getAudioPlayerMetadata(country: ICountry): interfaces.audioplayer.AudioItemMetadata {
  return {
    art: {
      sources: [
        {
          size: "LARGE",
          url: country.flag.largeImageUrl,
        },
        {
          size: "SMALL",
          url: country.flag.smallImageUrl,
        },
      ],
    },
    backgroundImage: {
      sources: [
        {
          url: country.flag.largeImageUrl,
        },
      ],
    },
    subtitle: country.anthem.name,
    title: country.name,
  };
}

export function getPlayRenderTemplate(data: ICountry): interfaces.display.Template {
  let title = data.name;
  if (data.anthem.name) {
    title = `${title}: ${data.anthem.name}`;
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

@Intents("PlayAnthemIntent")
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
    if (data && data.anthem.url) {
      return responseBuilder
        .speak(t("play.text", data.name))
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(data, true),
          data.iso3, 0, undefined, getAudioPlayerMetadata(data))
        .withShouldEndSession(true)
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

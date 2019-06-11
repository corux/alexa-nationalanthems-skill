import { BaseRequestHandler, IExtendedHandlerInput, Intents } from "@corux/ask-extensions";
import { ICountry } from "@corux/country-data";
import { IntentRequest, interfaces, Response } from "ask-sdk-model";
import countries from "../data/countries";
import { getAnthemUrl, getSlotValue, getTArgument } from "../utils";

export function getCountryFromAudioPlayer(handlerInput: IExtendedHandlerInput): ICountry {
  const response = parseAudioToken(handlerInput);
  return response && response.country;
}

export function parseAudioToken(handlerInput: IExtendedHandlerInput, token?: string)
  : { country: ICountry, loopMode: boolean, shuffleMode: boolean } {
  const locale = handlerInput.getLocale();
  const tokenParts = (token || handlerInput.requestEnvelope.context.AudioPlayer.token || "").split(":");
  const iso = tokenParts[0];
  const country = countries.getByIso3(iso, locale);
  if (country) {
    return {
      country,
      loopMode: tokenParts[1] === "1",
      shuffleMode: tokenParts[2] === "1",
    };
  }
}

export function createAudioToken(country: ICountry, loopMode: boolean = false, shuffleMode: boolean = false) {
  return [
    country.iso3,
    loopMode ? 1 : 0,
    shuffleMode ? 1 : 0,
  ].join(":");
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

@Intents("PlayAnthemIntent")
export class PlayAnthemHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    const responseBuilder = handlerInput.getResponseBuilder();
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.t;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
    const { name: countryName, id: countryId } = { ...getSlotValue(intent.slots.country) };
    if (!countryName) {
      return responseBuilder
        .speak(t("launch"))
        .reprompt(t("launch"))
        .getResponse();
    }

    const allCountries = countries.getAll(handlerInput.getLocale());
    const data = allCountries.find((val) => val.iso3 === countryId)
      || allCountries.find((val) => (val.name || "").toUpperCase() === countryName.toUpperCase());
    if (data && data.anthem.url) {
      return responseBuilder
        .speak(t("play.text", getTArgument(data, handlerInput.getLocale())))
        .addAudioPlayerPlayDirective("REPLACE_ALL", getAnthemUrl(data, true),
          createAudioToken(data, session.loopMode, session.shuffleMode), 0, undefined, getAudioPlayerMetadata(data))
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
      .speak(t("play.unknown-country", data ? getTArgument(data, handlerInput.getLocale()) : { country: countryName }))
      .reprompt(t("play.reprompt"))
      .getResponse();
  }
}

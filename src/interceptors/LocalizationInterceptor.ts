import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import * as i18n from "i18next";
import * as sprintf from "i18next-sprintf-postprocessor";

import * as locale_de from "../i18n/de.json";
import * as locale_en from "../i18n/en.json";
import * as locale_fr from "../i18n/fr.json";

export class LocalizationInterceptor implements RequestInterceptor {
  public process(handlerInput: HandlerInput) {
    i18n
      .use(sprintf)
      .init({
        defaultNS: "translation",
        lng: handlerInput.requestEnvelope.request.locale,
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        resources: {
          de: {
            translation: locale_de,
          },
          en: {
            translation: locale_en,
          },
          fr: {
            translation: locale_fr,
          },
        },
        returnObjects: true,
      }, (err, t) => {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args: any[]) => {
          return (t as any)(...args);
        };
      });
  }
}

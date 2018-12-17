import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import i18next, * as i18n from "i18next";
import * as sprintf from "i18next-sprintf-postprocessor";

import * as locale_de from "../i18n/de.json";
import * as locale_en from "../i18n/en.json";
import * as locale_es from "../i18n/es.json";
import * as locale_fr from "../i18n/fr.json";
import * as locale_it from "../i18n/it.json";
import { getLocale } from "../utils";

export class LocalizationInterceptor implements RequestInterceptor {
  public process(handlerInput: HandlerInput) {
    (i18n as any as i18next.i18n)
      .use(sprintf)
      .init({
        defaultNS: "translation",
        lng: getLocale(handlerInput),
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        resources: {
          de: {
            translation: locale_de,
          },
          en: {
            translation: locale_en,
          },
          es: {
            translation: locale_es,
          },
          fr: {
            translation: locale_fr,
          },
          it: {
            translation: locale_it,
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

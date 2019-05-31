import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import i18next, * as i18n from "i18next";
import * as sprintf from "i18next-sprintf-postprocessor";
import * as Backend from "i18next-sync-fs-backend";

import { getLocale } from "../utils";

export class LocalizationInterceptor implements RequestInterceptor {
  public constructor(private readonly loadPath: string = "i18n/{{lng}}.json") {}

  public process(handlerInput: HandlerInput) {
    (i18n as any as i18next.i18n)
      .use(sprintf)
      .use(Backend)
      .init({
        backend: {
          loadPath: this.loadPath,
        },
        defaultNS: "translation",
        initImmediate: false,
        lng: getLocale(handlerInput),
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        returnObjects: true,
      }, (err, t) => {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = this.randomTranslation(t);
      });
  }

  private randomTranslation(t: any): any {
    return (...args: any[]) => {
      const values = args.slice(1);

      const value = t(args[0], {
        postProcess: "sprintf",
        returnObjects: true,
        sprintf: values,
      });

      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      } else {
        return value;
      }
    };
  }
}

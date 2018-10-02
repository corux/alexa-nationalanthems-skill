import { HandlerInput } from "ask-sdk-core";

export function getLocale(handlerInput: HandlerInput): Locale {
  return (handlerInput.requestEnvelope.request as { locale: string }).locale as Locale;
}

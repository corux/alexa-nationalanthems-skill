import {
  BaseRequestHandler,
  IExtendedHandlerInput,
  Locale,
  Request,
} from "@corux/ask-extensions";
import { canfulfill, Response } from "ask-sdk-model";
import countries from "../data/countries";

@Request("CanFulfillIntentRequest")
export class CanFulfillIntentRequestHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    return handlerInput.responseBuilder
      .withCanFulfillIntent(this.canFulfill(handlerInput))
      .getResponse();
  }

  private canFulfill(
    handlerInput: IExtendedHandlerInput
  ): canfulfill.CanFulfillIntent {
    const request = handlerInput.requestEnvelope
      .request as canfulfill.CanFulfillIntentRequest;
    const isIntentSupported =
      ["PlayAnthemIntent"].indexOf(request.intent.name) !== -1;
    const hasSlotProvided =
      request.intent.slots &&
      request.intent.slots.country &&
      request.intent.slots.country.value;
    if (!isIntentSupported || !hasSlotProvided) {
      return { canFulfill: "NO" };
    }

    let canUnderstandSlot =
      request.intent.slots.country.resolutions &&
      !!request.intent.slots.country.resolutions.resolutionsPerAuthority.find(
        (val) => val.status.code === "ER_SUCCESS_MATCH"
      );

    const locale = handlerInput.getLocale() || "en-US";
    const countrySet = countries.getAll(locale).map((item) => ({
      item,
      names: []
        .concat(...[item.adjectives, item.altNames, [item.name, item.longName]])
        .filter((val) => !!val)
        .map((val) => val.toUpperCase()),
    }));

    // Find country by slot value
    const country = countrySet.find((item) =>
      item.names.includes(request.intent.slots.country.value.toUpperCase())
    );

    // Compare slot value, if entity resolution did not provide a value
    if (!canUnderstandSlot) {
      canUnderstandSlot = !!country;
    }

    const canFulfillSlot = country && country.item.anthem.url;

    return {
      canFulfill: canUnderstandSlot && canFulfillSlot ? "YES" : "NO",
      slots: {
        country: {
          canFulfill: canFulfillSlot ? "YES" : "NO",
          canUnderstand: canUnderstandSlot ? "YES" : "NO",
        },
      },
    };
  }
}

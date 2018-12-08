import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { canfulfill, Response } from "ask-sdk-model";
import countries from "../countries";

export class CanFulfillIntentRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "CanFulfillIntentRequest";
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    return handlerInput.responseBuilder
      .withCanFulfillIntent({
        canFulfill: this.isSupported(handlerInput) ? "YES" : "NO",
      })
      .getResponse();
  }

  private isSupported(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request as canfulfill.CanFulfillIntentRequest;
    const isIntentSupported = ["PlayAnthemIntent", "CountryIntent"].indexOf(request.intent.name) !== -1;
    if (!isIntentSupported) {
      return false;
    }

    let isSlotSupported = request.intent.slots.country
      && request.intent.slots.country.resolutions
      && request.intent.slots.country.resolutions.resolutionsPerAuthority[0]
      && request.intent.slots.country.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH";

    // Compare slot value, if entity resolution did not provide a value
    if (!isSlotSupported) {
      isSlotSupported = request.intent.slots.country
        && countries.getAll("en-US")
          .filter((item) => [].concat(...[item.adjectives, item.altNames, [item.name, item.longName]])).length > 0;
    }

    return isSlotSupported;
  }
}

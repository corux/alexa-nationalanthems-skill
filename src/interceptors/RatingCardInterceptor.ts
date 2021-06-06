import { IExtendedHandlerInput } from "@corux/ask-extensions";
import { ResponseInterceptor } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import i18next from "i18next";
import { DateTime, Interval } from "luxon";
import { IPersistentAttributes } from "../utils";

export class RatingCardInterceptor implements ResponseInterceptor {
  public async process(
    handlerInput: IExtendedHandlerInput,
    response?: Response
  ): Promise<void> {
    const attributes =
      (await handlerInput.attributesManager.getPersistentAttributes()) as IPersistentAttributes;
    let sessionCount: number = attributes.sessionCount || 0;
    const ratingDate: DateTime = DateTime.fromMillis(
      attributes.lastRatingCardTimestamp || 0
    );
    const lastCardShown = Interval.fromDateTimes(
      ratingDate,
      DateTime.local()
    ).length("months");

    if (
      !handlerInput.requestEnvelope ||
      !handlerInput.requestEnvelope.session ||
      !handlerInput.requestEnvelope.session.new
    ) {
      return;
    }

    attributes.sessionCount = ++sessionCount;
    const showRatingCard =
      !response.card &&
      sessionCount >= 4 &&
      lastCardShown > 2 &&
      i18next.exists("rating-card.text");

    if (showRatingCard) {
      attributes.lastRatingCardTimestamp = Date.now();

      response.card = {
        image: {
          smallImageUrl:
            "https://i35kgypfrd.execute-api.eu-west-1.amazonaws.com/production/https://s3-eu-west-1.amazonaws.com/alexa-nationalanthems-skill/icon512.png",
        },
        text: handlerInput.t("rating-card.text"),
        title: handlerInput.t("rating-card.title"),
        type: "Standard",
      };
    }

    handlerInput.attributesManager.savePersistentAttributes();
  }
}

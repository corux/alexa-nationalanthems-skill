import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.NoIntent", "AMAZON.YesIntent", "UnsupportedIntent")
export class UnsupportedHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    const session = handlerInput.attributesManager.getSessionAttributes();
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    const reprompt = session.quizMode ? t("quiz.reprompt") : t("play.reprompt");
    return handlerInput.responseBuilder
      .speak(`${t("unsupported")} ${reprompt}`)
      .reprompt(reprompt)
      .getResponse();
  }
}

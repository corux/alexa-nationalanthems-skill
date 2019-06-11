import { BaseRequestHandler, IExtendedHandlerInput, Request } from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    const t = handlerInput.t;

    return handlerInput.getResponseBuilder()
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

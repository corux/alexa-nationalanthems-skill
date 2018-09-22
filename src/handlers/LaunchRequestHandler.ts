import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { interfaces, Response } from "ask-sdk-model";
import { getResponseBuilder } from "../utils";

export function getLaunchTemplate(text: string): interfaces.display.Template {
  return {
    backButton: "HIDDEN",
    backgroundImage: {
      sources: [
        {
          size: "X_LARGE",
          url: "https://s3-eu-west-1.amazonaws.com/alexa-nationalanthems-skill/background.jpg",
        },
      ],
    },
    title: text,
    type: "BodyTemplate1",
  };
}

export class LaunchRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return getResponseBuilder(handlerInput)
      .addRenderTemplateDirectiveIfSupported(getLaunchTemplate(t("launch")))
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

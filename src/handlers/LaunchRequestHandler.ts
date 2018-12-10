import { HandlerInput } from "ask-sdk-core";
import { interfaces, Response } from "ask-sdk-model";
import { BaseIntentHandler, getResponseBuilder, Request } from "../utils";

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

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    return getResponseBuilder(handlerInput)
      .addRenderTemplateDirectiveIfSupported(getLaunchTemplate(t("launch")))
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

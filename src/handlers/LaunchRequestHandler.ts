import { BaseRequestHandler, IExtendedHandlerInput, Request } from "@corux/ask-extensions";
import { interfaces, Response } from "ask-sdk-model";

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
export class LaunchRequestHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    const t = handlerInput.t;

    return handlerInput.getResponseBuilder()
      // .addRenderTemplateDirectiveIfSupported(getLaunchTemplate(t("launch")))
      .speak(t("launch"))
      .reprompt(t("launch"))
      .getResponse();
  }
}

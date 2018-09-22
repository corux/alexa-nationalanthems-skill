import { HandlerInput, ResponseBuilder } from "ask-sdk-core";
import { interfaces } from "ask-sdk-model";

export interface IExtendedResponseBuilder extends ResponseBuilder {
  /**
   * Conditionally executes methods on the builder.
   * @param condition Condition to check. If true, the callback will be executed on the builder.
   * @param callback Code to run on the builder.
   */
  if(condition: boolean, callback: (builder: ResponseBuilder) => void): IExtendedResponseBuilder;

  /**
   * Adds the render template, if the Display interface is supported by the current request.
   * @param template The render template to add.
   */
  addRenderTemplateDirectiveIfSupported(template: interfaces.display.Template): IExtendedResponseBuilder;

  /**
   * Adds the hint, if the Display interface is supported by the current request.
   * @param template The hint to add.
   */
  addHintDirectiveIfSupported(text: string): IExtendedResponseBuilder;
}

export function supportsDisplay(handlerInput: HandlerInput): boolean {
  const hasDisplay = handlerInput.requestEnvelope.context
    && handlerInput.requestEnvelope.context.System
    && handlerInput.requestEnvelope.context.System.device
    && handlerInput.requestEnvelope.context.System.device.supportedInterfaces
    && handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
  return !!hasDisplay;
}

export function getResponseBuilder(handlerInput: HandlerInput): IExtendedResponseBuilder {
  const builder = handlerInput.responseBuilder as IExtendedResponseBuilder;

  builder.if = (condition, callback) => {
    if (condition) {
      callback(builder);
    }
    return builder;
  };
  builder.addRenderTemplateDirectiveIfSupported = (template) => {
    return builder.if(supportsDisplay(handlerInput), (n) => {
      n.addRenderTemplateDirective(template);
    });
  };
  builder.addHintDirectiveIfSupported = (text) => {
    return builder.if(supportsDisplay(handlerInput), (n) => {
      n.addHintDirective(text);
    });
  };

  return builder;
}

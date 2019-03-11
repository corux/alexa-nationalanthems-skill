import { SkillBuilders } from "ask-sdk-core";
import {
  AmazonCancelAndStopIntentHandler,
  AmazonHelpIntentHandler,
  AmazonRepeatIntentHandler,
  CanFulfillIntentRequestHandler,
  CustomErrorHandler,
  LaunchRequestHandler,
  PlayAnthemHandler,
  RandomHandler,
  SessionEndedHandler,
  UnsupportedHandler,
} from "./handlers";
import { LocalizationInterceptor, LogInterceptor } from "./interceptors";

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    new CanFulfillIntentRequestHandler(),
    new AmazonCancelAndStopIntentHandler(),
    new AmazonHelpIntentHandler(),
    new AmazonRepeatIntentHandler(),
    new RandomHandler(),
    new PlayAnthemHandler(),
    new LaunchRequestHandler(),
    new SessionEndedHandler(),
    new UnsupportedHandler(),
  )
  .addErrorHandlers(
    new CustomErrorHandler(),
  )
  .addRequestInterceptors(
    new LogInterceptor(),
    new LocalizationInterceptor(),
  )
  .addResponseInterceptors(
    new LogInterceptor(),
  )
  .lambda();

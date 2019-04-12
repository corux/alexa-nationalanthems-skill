import { SkillBuilders } from "ask-sdk-core";
import {
  AmazonCancelAndStopIntentHandler,
  AmazonHelpIntentHandler,
  AmazonPauseIntentHandler,
  AmazonRepeatIntentHandler,
  AmazonResumeIntentHandler,
  AudioPlayerUnsupportedHandler,
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
    new AudioPlayerUnsupportedHandler(),
    new CanFulfillIntentRequestHandler(),
    new AmazonCancelAndStopIntentHandler(),
    new AmazonPauseIntentHandler(),
    new AmazonResumeIntentHandler(),
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

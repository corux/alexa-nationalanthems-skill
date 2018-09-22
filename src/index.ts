import { SkillBuilders } from "ask-sdk-core";
import {
  AmazonCancelAndStopIntentHandler,
  AmazonHelpIntentHandler,
  AmazonRepeatIntentHandler,
  CustomErrorHandler,
  LaunchRequestHandler,
  PlayAnthemHandler,
  QuizAnswerHandler,
  QuizStartHandler,
  RandomHandler,
  SessionEndedHandler,
  SkipHandler,
  UnsupportedHandler,
} from "./handlers";
import { LocalizationInterceptor, LogInterceptor } from "./interceptors";

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    new AmazonCancelAndStopIntentHandler(),
    new AmazonHelpIntentHandler(),
    new AmazonRepeatIntentHandler(),
    new SkipHandler(),
    new RandomHandler(),
    new PlayAnthemHandler(),
    new QuizAnswerHandler(),
    new QuizStartHandler(),
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

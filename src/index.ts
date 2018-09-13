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
  SessionEndedHandler,
  SkipHandler,
} from "./handlers";
import { LogInterceptor } from "./interceptors";

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    new AmazonCancelAndStopIntentHandler(),
    new AmazonHelpIntentHandler(),
    new AmazonRepeatIntentHandler(),
    new SkipHandler(),
    new PlayAnthemHandler(),
    new QuizAnswerHandler(),
    new QuizStartHandler(),
    new LaunchRequestHandler(),
    new SessionEndedHandler(),
  )
  .addErrorHandlers(
    new CustomErrorHandler(),
  )
  .addRequestInterceptors(
    new LogInterceptor(),
  )
  .addResponseInterceptors(
    new LogInterceptor(),
  )
  .lambda();

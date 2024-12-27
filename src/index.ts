import {
  LocalizationInterceptor,
  LogInterceptor,
  SessionEndedHandler,
} from "@corux/ask-extensions";
import { SkillBuilders } from "ask-sdk-core";
import { DynamoDbPersistenceAdapter } from "ask-sdk-dynamodb-persistence-adapter";
import * as path from "path";
import {
  AmazonCancelAndStopIntentHandler,
  AmazonHelpIntentHandler,
  AmazonLoopIntentHandler,
  AmazonPauseIntentHandler,
  AmazonRepeatIntentHandler,
  AmazonResumeIntentHandler,
  AmazonShuffleIntentHandler,
  AudioPlayerPlaybackHandler,
  AudioPlayerUnsupportedHandler,
  CanFulfillIntentRequestHandler,
  CustomErrorHandler,
  LaunchRequestHandler,
  PlayAnthemHandler,
  RandomHandler,
  UnsupportedHandler,
} from "./handlers";
import { RatingCardInterceptor } from "./interceptors";

const dynamodbAdapter = new DynamoDbPersistenceAdapter({
  createTable: true,
  tableName: "alexa-nationalanthems-skill",
});

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    new AudioPlayerUnsupportedHandler(),
    new AudioPlayerPlaybackHandler(),
    new CanFulfillIntentRequestHandler(),
    new AmazonCancelAndStopIntentHandler(),
    new AmazonPauseIntentHandler(),
    new AmazonResumeIntentHandler(),
    new AmazonHelpIntentHandler(),
    new AmazonRepeatIntentHandler(),
    new AmazonLoopIntentHandler(),
    new AmazonShuffleIntentHandler(),
    new RandomHandler(),
    new PlayAnthemHandler(),
    new LaunchRequestHandler(),
    new SessionEndedHandler(),
    new UnsupportedHandler()
  )
  .addErrorHandlers(new CustomErrorHandler())
  .addRequestInterceptors(
    new LogInterceptor(),
    new LocalizationInterceptor(path.join(__dirname, "i18n/{{lng}}.json"))
  )
  .addResponseInterceptors(new LogInterceptor())
  .withPersistenceAdapter(dynamodbAdapter)
  .lambda();

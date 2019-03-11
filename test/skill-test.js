import test from 'ava';
import { handler as Skill } from '../build/skill';
import Request from 'alexa-request';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);

test('LaunchRequest', async () => {
  const event = Request.launchRequest().build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Welche Nationalhymne möchtest du abspielen?');
  expect(response).to.containSubset({
    response: {
      shouldEndSession: false,
      outputSpeech: { type: 'PlainText' }
    }
  });
});

test('AMAZON.StopIntent', async () => {
  const event = Request.intent('AMAZON.StopIntent').build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
    }
  });
});

test('AMAZON.CancelIntent', async () => {
  const event = Request.intent('AMAZON.CancelIntent').build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
    }
  });
});

test('AMAZON.HelpIntent', async () => {
  const event = Request.intent('AMAZON.HelpIntent').build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Was möchtest du als nächstes tun?');
});

test('SkipIntent should ask for next anthem', async () => {
  const event = Request.intent('SkipIntent').build();
  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Welche Nationalhymne möchtest du als nächstes abspielen?');
});

test('RepeatIntent should not fail if there is nothing to repeat', async () => {
  const event = Request.intent('AMAZON.RepeatIntent').build();
  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Es gibt nichts zu wiederholen.');
});

test('Play anthem for country with anthem', async () => {
  const event = Request.intent('PlayAnthemIntent', { country: 'deutschland' }).build();
  const response = await Skill(event);
  expect(response.response.outputSpeech.ssml).to.contain('Hier ist die Nationalhymne von Deutschland');
  expect(response.response.outputSpeech.ssml).to.contain('/DEU.mp3');
});

test('Play anthem for country without anthem', async () => {
  const event = Request.intent('PlayAnthemIntent', { country: 'südossetien' }).build();
  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Ich kenne die Nationalhymne von Südossetien leider nicht. Bitte wähle ein anderes Land.');
});

test('Play anthem without given country', async () => {
  const event = Request.intent('PlayAnthemIntent', {}).build();
  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Welche Nationalhymne möchtest du abspielen?');
});

test('SessionEndedRequest', async () => {
  const event = Request.sessionEndedRequest().build();
  const response = await Skill(event);
  expect(response).to.deep.equal({});
});

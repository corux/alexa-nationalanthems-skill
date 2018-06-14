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

test('SkipIntent should ask for next anthem when not in quiz mode', async () => {
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

test('Start quiz', async () => {
  const event = Request.intent('QuizIntent', { continent: 'europa' }).session({}).build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.ssml).to.contain('Willkommen beim Quiz.');
});

test('Correct quiz answer', async () => {
  const event = Request.intent('CountryIntent', { country: 'deutschland' }).session({
    attributes: {
      quizMode: true,
      iso: 'DEU'
    }
  }).build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.ssml).to.contain('Das war richtig!');
});

test('Incorrect quiz answer', async () => {
  const event = Request.intent('CountryIntent', { country: 'frankreich' }).session({
    attributes: {
      quizMode: true,
      iso: 'DEU',
      try: 0
    }
  }).build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Das war nicht richtig.');
});

test('Incorrect quiz answer after 3rd try tell result', async () => {
  const event = Request.intent('CountryIntent', { country: 'frankreich' }).session({
    attributes: {
      quizMode: true,
      iso: 'DEU',
      try: 2
    }
  }).build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.ssml).to.contain('Die richtige Antwort war Deutschland.');
});

test('SessionEndedRequest', async () => {
  const event = Request.sessionEndedRequest().build();
  const response = await Skill(event);
  expect(response).to.deep.equal({});
});

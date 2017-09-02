import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import ssml from 'alexa-ssml-jsx';

import countries from './countries';

@Skill
export default class AlexaNationalAnthemsSkill {

  _getQuestion(continent) {
    const country = this._getNextCountry(continent);
    return {
      iso: country.iso3,
      question: `Hymne von ${country.name}?`,
      try: 0
    };
  }

  _handleAnswer(answer, session) {
    if (!session || !session.attributes || !session.attributes.iso) {
      return this.launch();
    }

    const expectedAnswer = countries.getByIso3(session.attributes.iso).name;
    if (answer && answer.toUpperCase() === expectedAnswer.toUpperCase()) {
      const data = this._getQuestion(session.attributes.continent);
      data.correctQuestions = session.attributes.correctQuestions + 1;
      return ask(`Das war richtig! ${data.question}`)
        .reprompt(data.question)
        .attributes(data);
    }

    session.attributes.success = false;
    session.attributes.try++;
    if (session.attributes.try >= 3) {
      const data = this._getQuestion(session.attributes.continent);
      data.wrongQuestions = session.attributes.wrongQuestions + 1;
      return ask(`Die richtige Antwort war ${expectedAnswer}. Hier ist die nächste Hymne.`)
        .reprompt('Zu welchem Land gehört die gespielte Hymne?')
        .attributes(data);
    }

    return ask('Das war nicht richtig. Versuche es noch einmal.')
      .reprompt('Zu welchem Land gehört die gespielte Hymne?')
      .attributes(session.attributes);
  }

  _getRandomEntry(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  _getNextCountry(continent) {
    const matchesContinent = (country) => {
      return country.region && country.region.toUpperCase() === continent.toUpperCase();
    };
    return this._getRandomEntry(countries.getAll()
      .filter(val => val.anthem && (!continent || matchesContinent(val))));
  }

  _getSlotValue(request, name) {
    try {
      const slot = request.intent.slots[name];
      if (slot.resolutions.resolutionsPerAuthority[0].status.code !== 'ER_SUCCESS_MATCH') {
        return null;
      }

      return slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (e) {
      return null;
    }
  }

  @Launch
  launch() {
    return ask('Welche Nationalhymne möchtest du abspielen?');
  }

  @Intent('PlayAnthemIntent')
  playAnthemIntent({ country }, { request }) {
    const data = countries.getAll().filter(val => val.name.toUpperCase() === (this._getSlotValue(request, 'country') || country).toUpperCase())[0];
    if (data && data.anthem) {
      return ask(`Hier ist die Nationalhymne von ${data.name}`)
        .reprompt('Welche Nationalhymne möchtest du als nächstes abspielen?');
    }

    return ask(`Ich kenne die Nationalhymne von ${data.name || country} leider nicht. Bitte wähle ein anderes Land.`)
      .reprompt('Welche Nationalhymne möchtest du als nächstes abspielen?');
  }

  @Intent('QuizIntent')
  quizStartIntent({ continent }, { session }) {
    if (session && session.attributes && session.attributes.quizMode) {
      session.attributes.continent = continent;
      return ask(`Die Länder wurden auf ${continent} beschränkt.`)
        .attributes(session.attributes);
    }
    const data = this._getQuestion(continent);
    data.quizMode = true;
    data.continent = continent;
    data.wrongQuestions = 0;
    data.correctQuestions = 0;
    return ask('Willkommen beim Quiz. Versuche die Hymnen den richtigen Ländern zuzuordnen. ' + data.question)
      .attributes(data);
  }

  @Intent('QuizCountryIntent')
  quizAnswerIntent({ country }, { session, request }) {
    if (!session || !session.attributes.quizMode) {
      return playAnthemIntent({ country }, { session, request });
    }
    return this._handleAnswer(this._getSlotValue(request, 'country') || country, session);
  }

  @Intent('AMAZON.RepeatIntent')
  repeatIntent({}, { session }) {
    const data = session.attributes;
    return ask(data.question)
      .reprompt(data.question)
      .attributes(data);
  }

  @Intent('SkipIntent', 'AMAZON.NextIntent')
  skipIntent({}, { session }) {
    const data = this._getQuestion(session.attributes.continent);
    data.wrongQuestions = session.attributes.wrongQuestions + 1;
    return ask(`Die richtige Antwort war ${data.country}. Hier ist die nächste Frage. ${data.question}`)
      .reprompt(data.question)
      .attributes(data);
  }

  @Intent('AMAZON.HelpIntent')
  help({}, { session }) {
    const data = session.attributes;
    const country = this._getNextCountry();
    let returnValue = ask(`Du kannst dir die National Hymnen von verschiedenen Ländern vorspielen lassen. Sage zum Beispiel "Spiel die Nationalhymne von ${country.name}. Um das Quiz zu starten, sage "Starte das Quiz".`);
    if (data.question) {
      returnValue = returnValue
        .reprompt(data.question)
        .attributes(data);
    }

    return returnValue;
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say('Bis bald!');
  }

  @SessionEnded
  sessionEnded() {
    // need to handle session ended event to circumvent error
    return {};
  }

}

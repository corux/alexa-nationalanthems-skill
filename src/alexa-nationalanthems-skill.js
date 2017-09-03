import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import ssml from 'alexa-ssml-jsx';

import countries from './countries';

@Skill
export default class AlexaNationalAnthemsSkill {

  reprompt = 'Zu welchem Land gehörte die gespielte Hymne?';

  _getQuestion(continent) {
    const country = this._getNextCountry(continent);
    return {
      iso: country.iso3,
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
      return ask(`<speak>
            Das war richtig!
            Hier ist die nächste Hymne:
            <audio src="${this._getAudioUrl(countries.getByIso3(data.iso))}" />
            ${this.reprompt}
          </speak>`, 'SSML')
        .reprompt(this.reprompt)
        .attributes(data);
    }

    session.attributes.success = false;
    session.attributes.try++;
    if (session.attributes.try >= 3) {
      const data = this._getQuestion(session.attributes.continent);
      return ask(`<speak>
            Das war nicht richtig. Die richtige Antwort war ${expectedAnswer}.
            Hier ist die nächste Hymne:
            <audio src="${this._getAudioUrl(countries.getByIso3(data.iso))}" />
            ${this.reprompt}
          </speak>`, 'SSML')
        .reprompt(this.reprompt)
        .attributes(data);
    }

    return ask('Das war nicht richtig. Versuche es noch einmal.')
      .reprompt(this.reprompt)
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

  _getAudioUrl(country) {
    return `https://s3-eu-west-1.amazonaws.com/alexa-countryquiz-skill-anthems/${country.iso3}.mp3`;
  }

  @Launch
  launch() {
    return ask('Welche Nationalhymne möchtest du abspielen?');
  }

  @Intent('PlayAnthemIntent')
  playAnthemIntent({ country }, { request }) {
    const data = countries.getAll().filter(val => val.name.toUpperCase() === (this._getSlotValue(request, 'country') || country).toUpperCase())[0];
    const reprompt = 'Welche Nationalhymne möchtest du als nächstes abspielen?';
    if (data && data.anthem) {
      return ask(`<speak>
            Hier ist die Nationalhymne von ${data.name}.
            <audio src="${this._getAudioUrl(data)}" />
            ${reprompt}
          </speak>`, 'SSML')
        .reprompt(reprompt)
        .attributes({
          iso: data.iso3,
          quizMode: false
        });
    }

    return ask(`Ich kenne die Nationalhymne von ${data.name || country} leider nicht. Bitte wähle ein anderes Land.`)
      .reprompt(reprompt);
  }

  @Intent('QuizIntent')
  quizStartIntent({ continent }, { session, request }) {
    continent = this._getSlotValue(request, 'continent');
    let text = `Willkommen beim Quiz. Versuche die Hymnen den richtigen Ländern zuzuordnen.
                Hier ist die erste Nationalhymne:`;
    let data = this._getQuestion(continent);
    data.quizMode = true;
    data.continent = continent;

    if (session && session.attributes && session.attributes.quizMode) {
      if (!continent) {
        text = 'Die Beschränkung der Länder wurde aufgehoben. Hier ist die nächste Nationalhymne:';
      } else {
        text = `Die Länder wurden auf ${continent} beschränkt. Hier ist die nächste Nationalhymne:`;
      }
    }

    const country = countries.getByIso3(data.iso);
    return ask(`<speak>
          ${text}
          <audio src="${this._getAudioUrl(country)}" />
          ${this.reprompt}
        </speak>`, 'SSML')
      .reprompt(this.reprompt)
      .attributes(data);
  }

  @Intent('CountryIntent')
  quizAnswerIntent({ country }, { session, request }) {
    if (!session || !session.attributes || !session.attributes.quizMode) {
      return this.playAnthemIntent({ country }, { session, request });
    }
    return this._handleAnswer(this._getSlotValue(request, 'country') || country, session);
  }

  @Intent('AMAZON.RepeatIntent')
  repeatIntent({}, { session }) {
    if (session && session.attributes && session.attributes.quizMode) {
      const data = session.attributes;
      const country = countries.getByIso3(data.iso);
      return ask(`<speak>
            <audio src="${this._getAudioUrl(country)}" />
            ${this.reprompt}
          </speak>`, 'SSML')
        .reprompt(this.reprompt)
        .attributes(data);
    }

    if (session && session.attributes && session.attributes.iso) {
      return ask(`<speak>
            <audio src="${this._getAudioUrl(countries.getByIso3(session.attributes.iso))}" />
          </speak>`, 'SSML')
        .reprompt(this.reprompt)
        .attributes(session.attributes);
    }

    return say('Es gibt nichts zu wiederholen.');
  }

  @Intent('SkipIntent', 'AMAZON.NextIntent')
  skipIntent({}, { session }) {
    if (!session || !session.attributes || !session.attributes.quizMode) {
      return ask('Diese Funktion ist nur im Quiz Modus aktiv. Was möchtest du als nächstes tun?')
        .reprompt('Was möchtest du als nächstes tun?');
    }

    const data = this._getQuestion(session.attributes.continent);
    const country = countries.getByIso3(data.iso);
    return ask(`<speak>
          Die richtige Antwort war ${countries.getByIso3(session.attributes.iso).name}. Hier ist die nächste Hymne:
          <audio src="${this._getAudioUrl(country)}" />
          ${this.reprompt}
        </speak>`, 'SSML')
      .reprompt(this.reprompt)
      .attributes(data);
  }

  @Intent('AMAZON.HelpIntent')
  help({}, { session }) {
    const data = session.attributes;
    const country = this._getNextCountry('europa');
    let returnValue = ask(`Du kannst dir die Nationalhymnen von verschiedenen Ländern vorspielen lassen. Sage zum Beispiel "Spiel die Nationalhymne von ${country.name}. Um das Quiz zu starten, sage "Starte das Quiz".`);
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

import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("Localization", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  const launchMap = {
    "de-DE": "Welche Nationalhymne möchtest du abspielen?",
    "en-AU": "Which national anthem do you want to play?",
    "en-CA": "Which national anthem do you want to play?",
    "en-GB": "Which national anthem do you want to play?",
    "en-IN": "Which national anthem do you want to play?",
    "en-US": "Which national anthem do you want to play?",
    "es-ES": "¿Qué himno nacional quieres tocar?",
    "es-MX": "¿Qué himno nacional quieres tocar?",
    "fr-FR": "Quel hymne national voulez-vous jouer?",
    "it-IT": "In quale inno nazionale vuoi suonare?",
    "pt-BR": "Qual hino nacional você quer tocar?",
  };

  const playAnthemMap = {
    "de-DE": "Hier ist die Nationalhymne von Deutschland.",
    "en-AU": "Here's the national anthem of Germany.",
    "en-CA": "Here's the national anthem of Germany.",
    "en-GB": "Here's the national anthem of Germany.",
    "en-IN": "Here's the national anthem of Germany.",
    "en-US": "Here's the national anthem of Germany.",
    "es-ES": "Aquí está el himno nacional de Alemania.",
    "es-MX": "Aquí está el himno nacional de Alemania.",
    "fr-FR": "Voici l'hymne national de Allemagne.",
    "it-IT": "Ecco l'inno nazionale per la Germania.",
    "pt-BR": "Aqui está o hino nacional da Alemanha.",
  };

  const locales = Object.keys(launchMap);

  locales.forEach((locale) => {
    test(locale, async () => {
      alexa.filter((requestJSON) => {
        requestJSON.request.locale = locale;
      });
      let result = await alexa.request().launch().send();
      expect(result.response.outputSpeech.ssml).toContain(launchMap[locale]);

      result = await alexa.request().intent("PlayAnthemIntent").slot("country", "Germany").send();
      expect(result.response.outputSpeech.ssml).toContain(playAnthemMap[locale]);
    });
  });
});

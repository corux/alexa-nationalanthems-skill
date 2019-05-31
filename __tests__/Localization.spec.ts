import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("Localization", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  const map = {
    "de-DE": "Welche Nationalhymne möchtest du abspielen?",
    "en-AU": "Which national anthem do you want to play",
    "en-CA": "Which national anthem do you want to play",
    "en-GB": "Which national anthem do you want to play",
    "en-IN": "Which national anthem do you want to play",
    "en-US": "Which national anthem do you want to play",
    "es-ES": "¿Qué himno nacional quieres tocar?",
    "es-MX": "¿Qué himno nacional quieres tocar?",
    "fr-FR": "Quel hymne national voulez-vous jouer?",
    "it-IT": "In quale inno nazionale vuoi suonare?",
    "pt-BR": "Qual hino nacional você quer tocar?",
  };

  Object.keys(map).forEach((locale) => {
    test(locale, async () => {
      alexa.filter((requestJSON) => {
        requestJSON.request.locale = locale;
      });
      const result = await alexa.request().launch().send();
      expect(result.response.outputSpeech.ssml).toContain(map[locale]);
    });
  });
});

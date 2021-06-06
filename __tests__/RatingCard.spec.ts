import { VirtualAlexa } from "virtual-alexa";
import { createVirtualAlexa } from "../test-utils/utils";

describe("Rating Card", () => {
  let alexa: VirtualAlexa;
  const ratingSessionCount = 4;
  beforeEach(() => {
    alexa = createVirtualAlexa();
  });

  test("Show rating card on second session for supported locale", async () => {
    alexa.filter((requestJSON) => {
      requestJSON.request.locale = "de-DE";
    });

    for (let i = 0; i < ratingSessionCount + 1; i++) {
      const result = await alexa.launch();
      await alexa.endSession();

      if (i === ratingSessionCount - 1) {
        expect(result.response.card).not.toBeUndefined();
        expect(result.response.card.title).toBe(
          "Nationalhymnen: Bitte um Bewertung"
        );
      } else {
        expect(result.response.card).toBeUndefined();
      }
    }
  });

  test("Do not show rating card for unsupported locales", async () => {
    for (let i = 0; i < ratingSessionCount + 1; i++) {
      const result = await alexa.launch();
      await alexa.endSession();

      expect(result.response.card).toBeUndefined();
    }
  });
});

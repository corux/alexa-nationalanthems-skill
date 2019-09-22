import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("CanFulfillIntentRequest", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
    alexa.dynamoDB().mock();
  });

  test("Should return YES for valid country", async () => {
    const result = await alexa.request()
      .intent("PlayAnthemIntent")
      .slot("country", "Germany")
      .requestType("CanFulfillIntentRequest")
      .send();

    expect(result.response.canFulfillIntent.canFulfill).toBe("YES");
    expect(result.response.canFulfillIntent.slots.country.canFulfill).toBe("YES");
    expect(result.response.canFulfillIntent.slots.country.canUnderstand).toBe("YES");
  });

  test("Should return NO for invalid country", async () => {
    const result = await alexa.request()
      .intent("PlayAnthemIntent")
      .slot("country", "InvalidValue")
      .requestType("CanFulfillIntentRequest")
      .send();

    expect(result.response.canFulfillIntent.canFulfill).toBe("NO");
    expect(result.response.canFulfillIntent.slots.country.canFulfill).toBe("NO");
    expect(result.response.canFulfillIntent.slots.country.canUnderstand).toBe("NO");
  });

  test("Should return NO if no country is specified", async () => {
    const result = await alexa.request()
      .intent("PlayAnthemIntent")
      .requestType("CanFulfillIntentRequest")
      .send();

    expect(result.response.canFulfillIntent.canFulfill).toBe("NO");
    expect(result.response.canFulfillIntent.slots).toBeFalsy();
  });

  test("Should return NO for unsupported Intent", async () => {
    const result = await alexa.request()
      .intent("AMAZON.HelpIntent")
      .requestType("CanFulfillIntentRequest")
      .send();

    expect(result.response.canFulfillIntent.canFulfill).toBe("NO");
  });
});

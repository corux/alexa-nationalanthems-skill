import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("CanFulfillIntentRequest", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/en-US.json")
      .create();
  });

  test("Should return YES for valid country", async () => {
    const result: any = await alexa.filter((request) => {
      request.request.type = "CanFulfillIntentRequest";
    }).utter("play the anthem of Germany");

    expect(result.response.canFulfillIntent.canFulfill).toBe("YES");
  });

  test("Should return NO for invalid country", async () => {
    const result: any = await alexa.filter((request) => {
      request.request.type = "CanFulfillIntentRequest";
    }).intend("PlayAnthemIntent", {
      country: "InvalidValue",
    });

    expect(result.response.canFulfillIntent.canFulfill).toBe("NO");
  });

  test("Should return NO for unsupported Intent", async () => {
    const result: any = await alexa.filter((request) => {
      request.request.type = "CanFulfillIntentRequest";
    }).utter("help");

    expect(result.response.canFulfillIntent.canFulfill).toBe("NO");
  });
});

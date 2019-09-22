import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

export function createVirtualAlexa(): any {
  const alexa = VirtualAlexa.Builder()
    .handler(handler)
    .interactionModelFile("models/en-US.json")
    .create();
  alexa.filter((requestJSON) => {
    requestJSON.request.locale = "un-UNSUPPORTED";
  });
  alexa.context().device().audioPlayerSupported(true);
  alexa.dynamoDB().mock();
  return alexa;
}

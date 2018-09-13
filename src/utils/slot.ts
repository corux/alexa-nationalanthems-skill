import { Slot } from "ask-sdk-model";

export function getSlotValue(slot: Slot): string {
  if (!slot || !slot.value) {
    return null;
  }
  try {
    if (slot.resolutions.resolutionsPerAuthority[0].status.code !== "ER_SUCCESS_MATCH") {
      return slot.value;
    }

    return slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
  } catch (e) {
    return slot.value;
  }
}

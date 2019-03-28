import { Slot } from "ask-sdk-model";

export function getSlotValue(slot: Slot, returnDefaultValue: boolean = true): { name: string, id?: string } {
  if (!slot || !slot.value) {
    return null;
  }
  try {
    if (slot.resolutions.resolutionsPerAuthority[0].status.code !== "ER_SUCCESS_MATCH") {
      return returnDefaultValue ? { name: slot.value } : null;
    }

    return slot.resolutions.resolutionsPerAuthority[0].values[0].value;
  } catch (e) {
    return returnDefaultValue ? { name: slot.value } : null;
  }
}

import { Slot } from "ask-sdk-model";

export function getSlotValue(
  slot: Slot,
  returnDefaultValue: boolean = true
): { name: string; id?: string } {
  if (!slot || !slot.value) {
    return null;
  }
  try {
    const match = slot.resolutions.resolutionsPerAuthority.find(
      (val) => val.status.code === "ER_SUCCESS_MATCH"
    );
    if (!match) {
      return returnDefaultValue ? { name: slot.value } : null;
    }

    return match.values[0].value;
  } catch (e) {
    return returnDefaultValue ? { name: slot.value } : null;
  }
}

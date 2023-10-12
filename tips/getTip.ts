import { TipArray, Tip } from "./tipsTyped";

const LIMIT = 50;

function getTipForMode(tips: TipArray): Array<Tip> {
  const result: Array<Tip> = [];
  const allTypes: (typeof tips)[0]["tips"][0]["type"][] = [];
  // Flatten all 'type' arrays into the allTypes array
  let count = 0;
  for (const item of tips) {
    for (const tip of item.tips) {
      if (count++ > LIMIT) {
        break;
      }
      allTypes.push(...tip.type);
    }
  }

  // Shuffle the allTypes array
  for (let i = allTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTypes[i], allTypes[j]] = [allTypes[j], allTypes[i]];
  }

  // Get the first 5 elements
  return allTypes.slice(0, 5);
}

export default getTipForMode;

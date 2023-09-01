import { TipArray, Tip } from "./tipsTyped";

function findTipsForModes(tips: TipArray, modes: string[]): Array<Tip> {
  const result: Array<Tip> = [];

  if (tips && tips.tips) {
    modes.forEach((mode) => {
      const matchingTypes: Array<Tip> = [];

      tips.tips.forEach((tipGroup) => {
        if (tipGroup.tips) {
          const match = tipGroup.tips.find((tip) => tip.mode === mode);
          if (match && match.type) {
            matchingTypes.push(...match.type);
          }
        }
      });

      if (matchingTypes.length > 0) {
        //const randomIndex = Math.floor(Math.random() * matchingTypes.length);
        const randomIndex: number = 0;
        result.push(matchingTypes[randomIndex]);
      }
    });
  }

  return result;
}

export default findTipsForModes;

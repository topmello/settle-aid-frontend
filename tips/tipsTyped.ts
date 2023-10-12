import { tips as tipsCN } from "./tips-CN.json";
import { tips as tipsEN } from "./tips.json";
import { tips as tipsIN } from "./tips-IN.json";
import { SupportedLanguage } from "../store/appSlice";

export type Tip = {
  description: string;
  content: string;
  link: string;
  photo: string;
};

export type Tips = {
  mode?: string;
  type?: Tip[];
  title?: string;
  description?: string;
  tips?: Tips[];
};

export type TipArray = typeof tipsCN;

export const tips: {
  [key in SupportedLanguage]: typeof tipsCN;
} = {
  "zh-CN": tipsCN,
  "en-AU": tipsEN,
  "hi-IN": tipsIN,
};

export default tips;

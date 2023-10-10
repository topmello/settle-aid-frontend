import TipData from "./tips.json";

export interface Tip {
  description: string;
  content: string;
  link: string;
  photo: string;
}

export interface Tips {
  mode?: string;
  type?: Tip[];
  title?: string;
  description?: string;
  tips?: Tips[];
}

export interface TipArray {
  tips: Tips[];
}

const tips: TipArray = TipData;

export default tips;

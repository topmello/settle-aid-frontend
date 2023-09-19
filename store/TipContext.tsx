import React, { useEffect, useState, createContext, useMemo, useCallback } from "react";

export type Tip = {
  description: string;
  content: string;
  link?: string;
};

export type TipCategory = {
  mode: string;
  type: Tip[];
};

export type TipContextType = {
  category: TipCategory;
  tips: Tip[];
  currentTip: Tip;
  currentTipIndex: number;
  nextTip: () => void;
  prevTip: () => void;
  canNext: boolean;
  canPrev: boolean;
  clearTips: () => void;
  setCategory: (category: TipCategory) => void;
  resultTip: Tip | undefined;
  setResultTip: (tip: Tip) => void;
};

export const TipContext = createContext<TipContextType>({
  category: {
    mode: "",
    type: [],
  },
  tips: [],
  currentTip: {
    description: "",
    content: "",
  },
  currentTipIndex: 0,
  nextTip: () => {},
  prevTip: () => {},
  canNext: false,
  canPrev: false,
  clearTips: () => {},
  setCategory: () => {},
  resultTip: undefined,
  setResultTip: () => {},
});

export const TipProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTipIndex, setCurrentTipIndex] = React.useState<number>(0);
  const [category, setCategory] = useState<TipCategory>({
    mode: "",
    type: [],
  });
  const [resultTip, setResultTip] = useState<Tip>({
    description: "",
    content: "",
  });

  const tips = useMemo(() => {
    return category.type;
  }, [category]);

  const nextTip = useCallback(() => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    }
  }, [currentTipIndex, tips]);

  const prevTip = useCallback(() => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(currentTipIndex - 1);
    }}, [currentTipIndex]);

  const currentTip = useMemo(() => {
    if (tips.length < currentTipIndex) {
      setCurrentTipIndex(0);
    }
    return category.type[currentTipIndex];
  }, [currentTipIndex, category, tips]);

  const canNext = useMemo(() => {
    return currentTipIndex < tips.length - 1;
  }, [currentTipIndex, tips]);

  const canPrev = useMemo(() => {
    return currentTipIndex > 0;
  }, [currentTipIndex]); 

  const clearTips = () => {
    setCurrentTipIndex(0);
    setCategory({
      mode: "",
      type: [],
    });
  };

  return (
    <TipContext.Provider
      value={{
        category,
        setCategory,
        tips,
        currentTipIndex,
        nextTip,
        prevTip,
        canNext,
        canPrev,
        clearTips,
        currentTip,
        resultTip,
        setResultTip
      }}
    >
      {children}
    </TipContext.Provider>
  );
};

export const useTip = () => {
  const context = React.useContext(TipContext);
  if (context === undefined) {
    throw new Error("useTip must be used within a TipProvider");
  }
  return context;
}
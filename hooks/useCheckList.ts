import { useState, useEffect } from "react";

function useCheckedList(data: any) {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    if (data && data.instructions) {
      setChecked(Array(data.instructions.length).fill(false));
    }
  }, [data]);

  const handlePress = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  return { checked, handlePress };
}

export default useCheckedList;

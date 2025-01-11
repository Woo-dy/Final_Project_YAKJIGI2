// hooks/useSelectedItems.js
import { useState } from 'react';

const useSelectedItems = () => {
   const [selectedItems, setSelectedItems] = useState([]);

   const addSelectedItem = (item) => {
      setSelectedItems((prev) => [...prev, item]);
   };

   const removeSelectedItem = (item) => {
      setSelectedItems((prev) => prev.filter(i => i.item_seq !== item.item_seq));
   };

   const clearSelectedItems = () => {
      setSelectedItems([]);
   };

   return {
      selectedItems,
      addSelectedItem,
      removeSelectedItem,
      clearSelectedItems,
   };
};

export default useSelectedItems;
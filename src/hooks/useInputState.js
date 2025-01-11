import { useState } from 'react';

const useInputState = () => {
   const [inputData, setInputData] = useState([]);
   
   const updateInputData = (index, value) => {
      setInputData(prev => {
         const newData = [...prev];
         newData[index] = value;
         return newData;
      });
   };

   return [inputData, updateInputData];
};

export default useInputState;
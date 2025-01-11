import React, { useEffect, useState } from 'react';
import boardlog from '../styles/mypage/mybasicboardlogcommon.module.css';
import styles from '../styles/mypage/mybasicboardlogupdate.module.css';

function BoardRecordsSearchModal({ isOpen, onClose, onSubmit, selectedItems, dosageMethods, deletedItems }) {
   const [data, setData] = useState([]); // JSON 데이터를 저장할 상태 추가
   const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
   const [checkedItems, setCheckedItems] = useState([]); // 체크박스 상태 배열
   const [isAllChecked, setIsAllChecked] = useState(false); // 전체 선택 상태 추가
   const [dosageMethod, setDosageMethod] = useState(''); // 복용 방법 상태 추가
   const [dosageMethodsState, setDosageMethodsState] = useState([]); // 복용 방법 상태 배열 추가


   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = 'hidden';
         setSearchTerm(''); // 검색어 초기화
         // 체크 상태 초기화: selectedItems와 deletedItems를 기반으로 설정
         setCheckedItems(selectedItems.map(item => !deletedItems.includes(item.item_seq))); 
         setIsAllChecked(false); // 전체 선택 상태 초기화
         setDosageMethodsState(Array(selectedItems.length).fill('')); // 복용 방법 초기화
      } else {
         document.body.style.overflow = 'unset';
      }
   
      return () => {
         document.body.style.overflow = 'unset';
      };
   }, [isOpen, selectedItems, deletedItems]); // deletedItems를 의존성 배열에 추가

   // deletedItems가 변경될 때 체크박스 상태 업데이트
   useEffect(() => {
      setCheckedItems(prevCheckedItems => 
         prevCheckedItems.map((isChecked, index) => {
            const item = data[index];
            return item && !deletedItems.includes(item.item_seq) ? isChecked : false;
         })
      );
   }, [deletedItems, data]);


   useEffect(() => {
      if (isOpen) {
         fetch('/data/all_medi_data.json') // JSON 파일 경로
            .then((response) => response.json())
            .then((data) => setData(data)) // 데이터를 상태에 저장
            .catch((error) => console.error('Error fetching data:', error));
      }
   }, [isOpen]); // 모달이 열릴 때만 데이터 가져오기

   const handleSearchChange = (e) => {
      setSearchTerm(e.target.value); // 입력값을 상태에 저장
   };

   // 선택한 항목을 제외한 필터링된 데이터 생성
   const filteredData = data.filter(item => 
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // 체크박스 선택 시 값 변경
   const handleCheckboxChange = (index) => {
      setCheckedItems((prev) => {
         const newCheckedItems = [...prev];
         newCheckedItems[index] = !newCheckedItems[index]; // 체크 상태 반전
         return newCheckedItems;
      });
   };

   // 전체 선택 체크박스 핸들러
   const handleAllCheckboxChange = () => {
      const newCheckedItems = new Array(filteredData.length).fill(!isAllChecked); // 현재 상태를 반전
      setCheckedItems(newCheckedItems);
      setIsAllChecked(!isAllChecked); // 전체 선택 상태 반전
   };
   

   // 개별 체크박스 상태에 따라 전체 선택 체크박스 상태 업데이트
   useEffect(() => {
      if (filteredData.length > 0) {
         setIsAllChecked(checkedItems.length === filteredData.length && checkedItems.every(Boolean));
      }
   }, [checkedItems, filteredData]);

   const handleConfirm = () => {
      const selectedItems = filteredData.filter((_, index) => checkedItems[index]).map((item, index) => ({
         item_name: item.item_name, // 약품명 (품목명)
         entp_name: item.entp_name, // 업체명
         item_seq: item.item_seq, // 제품일련번호
         dosageMethod: dosageMethodsState[index] || '', // 복용 방법
         usagePurpose: item.usagePurpose
      }));
   
      if (selectedItems.length > 0) {
         onSubmit({ selectedItems, dosageMethods }); // write.jsx로 데이터 전송
         onClose(); // 모달 닫기
      } else {
         alert('체크된 항목이 없습니다.');
      }
   };


   if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

   return (
      <div
         className={`${boardlog.write__modalContainer} ${isOpen ? 'show' : ''}`}
         onClick={onClose}
      >
         <div className={boardlog.write__modalContent__box} onClick={(e) => e.stopPropagation()}>
            <ul className={boardlog.write__modal__search}>
                  <li>약품명으로 검색하기</li>
                  <li>
                     <button
                        className="material-icons"
                        onClick={onClose}
                     >
                        close
                     </button>
                  </li>
            </ul>
            
            <ul className={boardlog.write__search}>
               <li>
                  <input
                     type="text"
                     placeholder="약품명(품목명)을 입력하세요."
                     value={searchTerm} // 상태와 연결
                     onChange={handleSearchChange} // 핸들러 연결
                  />
                  <button className={boardlog.write__search__modalbtn}>
                     검색
                  </button>
               </li>
            </ul>
            
            <ul className={boardlog.write__search2}>
               <li>
                  <span className={boardlog.write__search__modalbtn2}>
                     복용 방법 
                  </span>
                  <input
                     type="text"
                     name="dosageMethod"
                     placeholder="복용 방법"
                     value={dosageMethod}
                     onChange={(e) => setDosageMethod(e.target.value)} // 입력값 업데이트
                  />
               </li>
            </ul>                     
            {/* <ul className={boardlog.write__search2}>
               <li>
                     <span className={boardlog.write__search__modalbtn2}>
                        사용 목적 <span className={boardlog.star}>*</span>
                     </span>
                     <input
                        type="text"
                        name="usagePurpose"
                        placeholder="사용 목적"
                        value={inputValues.usagePurpose}
                        onChange={handleInputChange}
                     />
               </li>
            </ul> */}

            <div className={styles.table}>
               <table className={styles.status__table}>
                  <thead>
                     <tr>                                 
                        <th>
                           {/* 전체선택 */}
                           <input 
                              type="checkbox" 
                              checked={isAllChecked} 
                              onChange={handleAllCheckboxChange} 
                              disabled={filteredData.length === 0} // 필터링된 데이터가 없으면 비활성화
                           />
                        </th>
                        <th>No</th>
                        <th>약품명 (품목명)</th>
                        <th>업체명</th>
                        <th>제품일련번호</th>
                     </tr>
                  </thead>
                  <tbody>
                  {filteredData.length === 0 ? ( // 필터링된 데이터가 없을 경우 메시지 표시
                     <tr>
                        <td colSpan="5" style={{ textAlign: 'center', fontWeight:'400' }}>검색하신 약품이 없습니다.</td>
                     </tr>
                  ) : (
                     filteredData.map((item, index) => (
                        <tr key={index} style={{ backgroundColor: selectedItems.some(selected => selected.item_seq === item.item_seq) ? "#f9f9f9" : "#fff" }}>
                           <td>
                              {/* 낱개선택 */}
                              <input 
                                 type="checkbox" 
                                 checked={checkedItems[index] || false} 
                                 onChange={() => handleCheckboxChange(index)} 
                                 disabled={selectedItems.some(selected => selected.item_seq === item.item_seq)} // 비활성화 처리
                              /><br/>
                              {item.item_seq}<br/>
                              {/* true or false */}
                              {checkedItems[index] !== undefined ? checkedItems[index].toString() : 'false'} {/* 체크 상태 표시 */}
                           </td>
                           <td>{index + 1}</td>
                           <td>{item.item_name}</td>
                           <td>{item.entp_name}</td>
                           <td>{item.item_seq}</td>
                        </tr>
                     ))
                  )}
                  </tbody>
               </table>
            </div>                     
            <button className={boardlog.confirmbtn} onClick={handleConfirm}>확인</button>
         </div>
      </div>
   );
}

export default BoardRecordsSearchModal;
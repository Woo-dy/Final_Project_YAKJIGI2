import commons from '../../styles/common.module.css';
import MyBasicMenu from '../../components/MyBasicMenu';
import boardlog from '../../styles/mypage/mybasicboardlogcommon.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Editor from '../../components/Editor';
import BoardRecordsSearchModal from '../../components/BoardRecordsSearchModal';
// import info from '../../styles/mypage/mybasicuserinfo.module.css';

function MyBasicBoardRecordsWrite(props) {
   const { mainTitle, subTitle } = useDocumentTitle();
   const [startDate, setStartDate] = useState(null);
   const [fileName, setFileName] = useState('');
   const [searchModalOpen, setSearchModalOpen] = useState(false); // 모달 상태 관리
   const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 상태
   const [inputData, setInputData] = useState(''); // 입력 데이터 상태
   const [dosageMethods, setDosageMethods] = useState([]); // 복용 방법 상태 추가
   const [deletedItems, setDeletedItems] = useState([]); // 삭제된 항목 상태 추가


   const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
         setFileName(file.name);
      }
   };

   const BasicBoardLogListBtn = (event) => {
      event.preventDefault(); // 기본 동작 방지
      window.location.href = '/mybasicboardrecords'; // 클릭 시에만 이동
   };

   // 모달에서 데이터 제출 처리
   const handleModalSubmit = (data) => {
      setSelectedItems(data.selectedItems); // 제출된 데이터 저장
      setDosageMethods(data.dosageMethods); // 복용 방법 저장
      console.log('제출된 데이터:', data); // 데이터 확인
      setSearchModalOpen(false); // 모달 닫기
   };


   // 전체 삭제 처리
   const handleDeleteAll = () => {
      setSelectedItems([]);
      setDosageMethods([]); // 복용 방법도 초기화
      setDeletedItems([]); // 삭제된 항목 초기화
   };

   // 개별 항목 삭제 처리
   const handleDeleteItem = (index) => {
      const newItems = selectedItems.filter((_, i) => i !== index);
      const newDosageMethods = dosageMethods.filter((_, i) => i !== index); // 복용 방법도 함께 삭제
      setSelectedItems(newItems);
      setDosageMethods(newDosageMethods);
      setDeletedItems((prev) => [...prev, selectedItems[index].item_seq]); // 삭제된 항목 추가
   };

   // 입력 데이터 변경 처리
   const handleInputChange = (event) => {
      setInputData(event.target.value);
   };


   const handleInputSubmit = (e) => {
      e.preventDefault(); // 기본 폼 제출 방지
   
      // 서버에 전송할 데이터 준비
      const dataToSend = {
         date: startDate, // 선택한 날짜
         items: selectedItems, // 선택한 약품 정보
         dosageMethods: dosageMethods, // 복용 방법 추가
         additionalInfo: inputData, // 기타 내용
         // 필요한 다른 데이터 추가
      };
   
      // 서버에 데이터 전송
      fetch('/api/save', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(dataToSend),
      })
      .then(response => {
         if (response.ok) {
            // 성공적으로 저장된 경우 처리
            console.log('Data saved successfully');
         } else {
            // 오류 처리
            console.error('Error saving data');
         }
      })
      .catch(error => {
         console.error('Error:', error);
      });
   };

   return (
      <>
         {/* 모달 컴포넌트 추가 */}
         <BoardRecordsSearchModal
            isOpen={searchModalOpen} 
            onClose={() => setSearchModalOpen(false)} // 모달 닫기 
            onSubmit={handleModalSubmit} // 데이터 제출 핸들러 전달
            selectedItems={selectedItems} // 선택한 항목 전달
            dosageMethods={dosageMethods} // 복용 방법 전달
            deletedItems={deletedItems} // 삭제된 항목 전달
         /> 

         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>

         {/* 마이 페이지 메뉴 */}
         <MyBasicMenu />

         {/* 입력 필드 추가 */}
         <form onSubmit={handleInputSubmit}>

            <div className={boardlog.boardlog__container}>
               <ul>
                  <li className={boardlog.boardlog__title}>
                     복용일자 <span className={boardlog.star}>*</span>
                  </li>
                  <li className={boardlog.boardlog__contents}>
                     <div className={boardlog.boardlog__date__calendar}>
                        <DatePicker
                           selected={startDate}
                           onChange={(date) => setStartDate(date)}
                           dateFormat="yyyy-MM-dd"
                           placeholderText="YYYY-MM-DD"
                           onChangeRaw={(e) => e.preventDefault()}
                           className={boardlog.boardlog__date__calendar__input}
                        />
                        <span className="material-icons">calendar_month</span>
                     </div>
                  </li>
                  <li className={boardlog.boardlog__title}>
                     <p>약 이름 <span className={boardlog.star}>*</span></p>
                  </li>
                  <li className={boardlog.boardlog__contents}>
                     <div className={boardlog.write__search__container}>
                        <input
                              type="text"
                              placeholder="검색하기를 클릭하세요"
                              readOnly
                           />
                        <div>
                           <button
                                 className={boardlog.write__search__btn}
                                 onClick={(e) => {
                                    e.preventDefault();  // 폼 제출을 방지   
                                    setSearchModalOpen(true); // 모달 열기
                                 }}
                           >
                              검색
                           </button>
                        </div>
                     </div>
                     <div className={boardlog.boardsearch__result}>
                        <table className={boardlog.boardsearch__table}>
                           <thead>
                              <tr>
                                 <th>약 이름</th>
                                 <th>복용 방법</th>
                                 <th>
                                    <span onClick={handleDeleteAll}>전체삭제</span>
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                           {selectedItems.length === 0 ? (
                              <tr>
                                 <td colSpan="3" style={{ textAlign: 'center' }}>
                                    검색을 눌러서 값을 넣어주세요.
                                 </td>
                              </tr>
                           ) : (
                              selectedItems.map((item, index) => (
                                 <tr key={index}>
                                    <td>{item.item_name}</td>
                                    <td>{item.dosageMethod}</td>
                                    <td>
                                       <button onClick={() => handleDeleteItem(index)}>
                                          <span className="material-symbols-outlined">remove</span>
                                       </button>
                                    </td>
                                 </tr>
                              ))
                           )}
                           </tbody>
                        </table>
                     </div>
                  </li>
                  
                  <li className={boardlog.boardlog__title}>
                     기타 내용
                  </li>
                  <li className={boardlog.boardlog__contents}>
                     <Editor />
                  </li>
                  <li className={boardlog.boardlog__title}>
                     사진 추가
                  </li>
                  <li className={boardlog.boardlog__contents}>
                     <div className={commons.filebox}>
                           <input
                              className={commons.uploadName}
                              value={fileName}
                              placeholder="파일찾기를 클릭해서 첨부파일을 등록해주세요."
                              readOnly
                           />
                           <label htmlFor="file">파일찾기</label>
                           <input
                              type="file"
                              id="file"
                              name="file_name"
                              onChange={handleFileChange} // 파일 변경 시 핸들러 호출
                           />
                     </div>
                  </li>
               </ul>
            </div>

            <input 
               type="text" 
               value={inputData} 
               onChange={handleInputChange} 
               placeholder="입력할 내용을 적어주세요" 
            />
            <button type="submit">제출</button>
         </form>

         <div className={boardlog.write_button_box}>                
               <div>
                  <button className={boardlog.board_write}>완료</button>    
                  <button className={boardlog.board_cancle} onClick={BasicBoardLogListBtn}>목록</button>    
               </div>
         </div>
      </>
   );
}

export default MyBasicBoardRecordsWrite;
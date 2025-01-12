import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import styles from '../../styles/qna/qnalist.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function QnaList(props) {
   const { mainTitle, subTitle } = useDocumentTitle();

   const [qnaData, setQnaData] = useState([]); // 전체 QnA 데이터
   const [filteredData, setFilteredData] = useState([]); // 검색 결과 데이터
   const [searchQuery, setSearchQuery] = useState(''); // 검색어
   const [loading, setLoading] = useState(true); // 로딩 상태
   const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
   const itemsPerPage = 10; // 한 페이지에 표시할 항목 수
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/qnatbl/list`; // API URL

   useEffect(() => {
      // 데이터 불러오기
      const fetchQnaData = async () => {
         try {
            const response = await axios.get(API_URL);
            if (response.data.success && response.data.data) {
               setQnaData(response.data.data); // 전체 데이터 설정
               setFilteredData(response.data.data); // 초기 검색 결과는 전체 데이터
            } else {
               console.error('Invalid API response:', response.data);
            }
         } catch (error) {
            console.error('Error fetching QnA data:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchQnaData();
   }, [API_URL]);

   // 총 페이지 수 계산
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

   // 현재 페이지의 데이터 계산
   const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const handleFirstPage = () => setCurrentPage(1); // 첫 페이지 이동
   const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1)); // 이전 페이지 이동
   const handleNextPage = () =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages)); // 다음 페이지 이동
   const handleLastPage = () => setCurrentPage(totalPages); // 마지막 페이지 이동

   // 페이징 버튼 범위 계산
   const getPageRange = () => {
      const maxButtons = 5; // 최대 페이지 버튼 수
      const startPage = Math.max(
         1,
         Math.min(
            currentPage - Math.floor(maxButtons / 2),
            totalPages - maxButtons + 1
         )
      );
      const endPage = Math.min(startPage + maxButtons - 1, totalPages);
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
   };

   // 검색 처리
   const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = qnaData.filter(
         (item) =>
            item.qna_title.toLowerCase().includes(query) || // 제목 검색
            (item.qna_answer_stat === 1 && '답변완료'.includes(query)) || // 답변완료 상태 검색
            (item.qna_answer_stat === 0 && '답변대기'.includes(query)) // 답변대기 상태 검색
      );
      setFilteredData(filtered); // 검색 결과 업데이트
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
   }; // **추가됨**

   const qnaDetailBtn = (idx) => {
      window.location.href = `/qnadetail/${idx}`;
   };

   const qnaWriteBtn = (event) => {
      event.preventDefault();
      window.location.href = '/qnawrite'; // 글쓰기 페이지 이동
   };

   if (loading) {
      return (
         <div className={commons.lodding_page}>
            <div>
               <img src="/images/favicon192.png" alt="로고" />
               <p>로딩 중...</p>
            </div>
         </div>
      );
   }

   return (
      <>
         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>

         <div className={styles.qnalist__container__box}>
         
            <div className={commons.common__boradsearch__container}>   
               <ul className={commons.common__boradsearch__ul}>
                  <li>총 <span>{filteredData.length}</span>건</li>
                  <li>
                     <form action="">
                        <div className={commons.common__searchbar__box}>
                           <input 
                              type="text"
                              value={searchQuery}
                              onChange={handleSearch} // **추가됨**
                              className={commons.common__search__input}
                              placeholder="검색어를 입력해주세요"
                           />
                           <span className="material-icons">search</span>
                        </div>
                     </form>
                  </li>
               </ul>
            </div> 

            <div className={styles.qnalist__container__list__table}>
               <table className={styles.qnalist__list_table}>
                  <thead>
                     <tr>
                        <th>No</th>
                        <th>제목</th>
                        <th>처리상태</th>
                        <th>등록일</th>
                     </tr>
                  </thead>
                  <tbody>
                     {paginatedData.map((item, index) => (
                        <tr key={item.qna_idx || index} onClick={() => qnaDetailBtn(item.qna_idx)}>
                           <td>{item.qna_idx}</td>
                           <td><p>{item.qna_title}</p></td>
                           <td>
                              <div
                                 className={
                                    item.qna_answer_stat === 1
                                       ? styles.qnalist__status_completed
                                       : styles.qnalist__status_waiting
                                 }
                              >
                                 {item.qna_answer_stat === 1 ? '답변완료' : '답변대기'}
                              </div>
                           </td>
                           <td>{item.qna_q_reg_date}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* 글쓰기 버튼 */}
            <div className={board.board_button_box}>
               <ul className={board.two}>
                  <li></li>
                  <li>
                     <Link onClick={qnaWriteBtn}>글쓰기</Link>
                  </li>
               </ul>
            </div>

            {/* 페이징 영역 */}
            <div>
               <ul className={commons.paging_num_ul}>
                  <li
                     className={`material-icons prev ${currentPage === 1 ? commons.disabled : ''}`}
                     onClick={currentPage > 1 ? handleFirstPage : null}
                  >
                     keyboard_double_arrow_left
                  </li>
                  <li
                     className={`material-icons prev ${currentPage === 1 ? commons.disabled : ''}`}
                     onClick={currentPage > 1 ? handlePrevPage : null}
                  >
                     chevron_left
                  </li>
                  {getPageRange().map((page) => (
                     <li
                        key={page}
                        className={`${currentPage === page ? commons.active : ''}`}
                        onClick={() => setCurrentPage(page)}
                     >
                        {page}
                     </li>
                  ))}
                  <li
                     className={`material-icons next ${currentPage === totalPages ? commons.disabled : ''}`}
                     onClick={currentPage < totalPages ? handleNextPage : null}
                  >
                     chevron_right
                  </li>
                  <li
                     className={`material-icons next ${currentPage === totalPages ? commons.disabled : ''}`}
                     onClick={currentPage < totalPages ? handleLastPage : null}
                  >
                     keyboard_double_arrow_right
                  </li>
               </ul>
            </div>
         </div>
      </>
   );
}

export default QnaList;
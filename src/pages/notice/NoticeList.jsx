import React, { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import styles from '../../styles/notice/noticelist.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';
import axios from 'axios';


function NoticeList(props) {
   const { mainTitle, subTitle } = useDocumentTitle();
   const [notices, setNotices] = useState([]); // 전체 공지 데이터
   const [filteredNotices, setFilteredNotices] = useState([]); // 검색 결과 데이터 **추가됨**
   const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 **추가됨**
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/noticetbl/list`;

   // 전체 공지의 총 페이지 수
   const totalPages = Math.ceil(filteredNotices.length / itemsPerPage); // **수정됨**

   useEffect(() => {
      const fetchNotices = async () => {
         try {
            const response = await axios.get(API_URL);
            if (response.data.success && response.data.data) {
               const sortedData = response.data.data.sort((a, b) => {
                  if (a.notice_check !== b.notice_check) {
                     return b.notice_check - a.notice_check; // notice_check 기준 정렬
                  }
                  return new Date(b.notice_reg_date) - new Date(a.notice_reg_date); // 날짜 기준 정렬
               });
               setNotices(sortedData);
               setFilteredNotices(sortedData); // 초기 검색 결과는 전체 데이터 **추가됨**
            } else {
               console.error('Invalid API response structure:', response.data);
            }
         } catch (error) {
            console.error('Error fetching notices:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchNotices();
   }, [API_URL]);

   const handleFirstPage = () => setCurrentPage(1);
   const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
   const handleNextPage = () =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const handleLastPage = () => setCurrentPage(totalPages);

   const getPageRange = (currentPage, totalPages) => {
      const maxButtons = 5; // 최대 버튼 개수
      const startPage = Math.max(
         1,
         Math.min(currentPage - Math.floor(maxButtons / 2), totalPages - maxButtons + 1)
      );
      const endPage = Math.min(startPage + maxButtons - 1, totalPages);
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
   };

   // 체크된 공지 데이터
   const checkedNotices = filteredNotices.filter((notice) => notice.notice_check); // **수정됨**
   const uncheckedNotices = filteredNotices.filter((notice) => !notice.notice_check); // **수정됨**

   // 현재 페이지의 데이터에서 체크되지 않은 공지만 포함
   const paginatedData = uncheckedNotices.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   // 검색 처리 **추가됨**
   const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = notices.filter(
         (notice) =>
            notice.notice_title.toLowerCase().includes(query) || // 제목에서 검색
            new Date(notice.notice_reg_date).toLocaleDateString().includes(query) // 날짜에서 검색
      );
      setFilteredNotices(filtered);
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
   };

   const noticeDetailBtn = (noticeId) => {
      window.location.href = `/noticedetail/${noticeId}`;
   };

   const noticeWriteBtn = () => {
      window.location.href = "/noticewrite";
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
         
         <div className={commons.common__boradsearch__container}>   
            <ul className={commons.common__boradsearch__ul}>
               <li>총 <span>{filteredNotices.length}</span>건</li> {/* **수정됨** */}
               <li>
                  <form>
                     <div className={commons.common__searchbar__box}>
                        <input
                           type="text"
                           value={searchQuery} // **추가됨**
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

         <div className={styles.noticelist__content_container}>
            <div className={styles.noticelist__content_main}>
               <div>
                  <table className={styles.noticelist__table}>
                     <thead>
                        {checkedNotices.map((notice) => (
                           <tr
                              key={notice.notice_idx}
                              className={`${styles.noticelist__tr} ${styles.noticelist__gong}`}
                              onClick={() => noticeDetailBtn(notice.notice_idx)}
                           >
                              <td className={styles.noticelist__cell1}><p>공지</p></td>
                              <td className={styles.noticelist__cell2}>
                                 <p>{notice.notice_title}</p>
                              </td>
                              <td className={styles.noticelist__cell3}>
                                 {new Date(notice.notice_reg_date).toLocaleDateString()}
                              </td>
                           </tr>
                        ))}
                     </thead>
                     <tbody>
                        {paginatedData.map((notice) => (
                           <tr
                              key={notice.notice_idx}
                              className={styles.noticelist__tr}
                              onClick={() => noticeDetailBtn(notice.notice_idx)}
                           >
                              <td className={styles.noticelist__cell1}>
                                 {notice.notice_idx}
                              </td>
                              <td className={styles.noticelist__cell2}>
                                 <p>{notice.notice_title}</p>
                              </td>
                              <td className={styles.noticelist__cell3}>
                                 {new Date(notice.notice_reg_date).toLocaleDateString()}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  <div className={board.board_button_box}>
                     <ul className={board.two}>
                        <li>
                        </li>
                        <li>
                           <Link onClick={noticeWriteBtn}>글쓰기</Link>
                        </li>
                     </ul>
                  </div>

                  {/* paging 영역 start */}
                  <div>
                     <ul className={commons.paging_num_ul}>
                        <li
                           className={`material-icons prev ${currentPage === 1 ? commons.disabled : ""}`}
                           onClick={currentPage > 1 ? handleFirstPage : null}
                        >
                           keyboard_double_arrow_left
                        </li>
                        <li
                           className={`material-icons prev ${currentPage === 1 ? commons.disabled : ""}`}
                           onClick={currentPage > 1 ? handlePrevPage : null}
                        >
                           chevron_left
                        </li>
                        {getPageRange(currentPage, totalPages).map((page) => (
                           <li
                              key={page}
                              className={`${page === currentPage ? commons.active : ""}`}
                              onClick={() => setCurrentPage(page)}
                           >
                              {page}
                           </li>
                        ))}
                        <li
                           className={`material-icons next ${currentPage === totalPages ? commons.disabled : ""}`}
                           onClick={currentPage < totalPages ? handleNextPage : null}
                        >
                           chevron_right
                        </li>
                        <li
                           className={`material-icons next ${currentPage === totalPages ? commons.disabled : ""}`}
                           onClick={currentPage < totalPages ? handleLastPage : null}
                        >
                           keyboard_double_arrow_right
                        </li>
                     </ul>
                  </div>
                  {/* paging 영역 end */}
               </div>
            </div>
         </div>
      </>
   );
}

export default NoticeList;
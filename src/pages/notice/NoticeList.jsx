import React, { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import styles from '../../styles/notice/noticelist.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';
import axios from 'axios';


function NoticeList(props) {
   const { mainTitle, subTitle } = useDocumentTitle();
   const [notices, setNotices] = useState([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10);
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/noticetbl/list`;

   // 전체 공지의 총 페이지 수
   const totalPages = Math.ceil(notices.length / itemsPerPage);

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

   // 체크된 공지 데이터// 체크된 공지 데이터
   const checkedNotices = notices.filter((notice) => notice.notice_check);
   const uncheckedNotices = notices.filter((notice) => !notice.notice_check);


   // 현재 페이지의 데이터에서 체크되지 않은 공지만 포함
   const paginatedData = uncheckedNotices.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const noticeDetailBtn = (noticeId) => {
      window.location.href = `/noticedetail/${noticeId}`;
   };

   const noticeWriteBtn = () => {
      window.location.href = "/noticewrite";
   };

   if (loading) {
      return <div className={commons.lodding_page}>
      <div>
         <img src="/images/favicon192.png" alt="로고" />
         <p>로딩 중...</p>
      </div>
   </div>;
   }

   return (
      <>

         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>
         
         <div className={commons.common__boradsearch__container}>   
            <ul className={commons.common__boradsearch__ul}>
               <li>총 <span>{notices.length}</span>건</li>
               <li>
                  <form action="">
                     <div className={commons.common__searchbar__box}>
                        <input type="text" className={commons.common__search__input} placeholder="검색어를 입력해주세요" />
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
                           className={`material-icons prev ${
                              currentPage === 1 ? commons.disabled : ""
                           }`}
                           onClick={currentPage === 1 ? null : handleFirstPage}
                        >
                           keyboard_double_arrow_left
                        </li>
                        <li
                           className={`material-icons prev ${
                              currentPage === 1 ? commons.disabled : ""
                           }`}
                           onClick={currentPage === 1 ? null : handlePrevPage}
                        >
                           chevron_left
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                           (page) => (
                              <li
                                 key={page}
                                 className={`${page === currentPage ? commons.active : ""}`}
                                 onClick={() => setCurrentPage(page)}
                              >
                                 {page}
                              </li>
                           )
                        )}
                        <li
                           className={`material-icons next ${
                              currentPage === totalPages ? commons.disabled : ""
                           }`}
                           onClick={currentPage === totalPages ? null : handleNextPage}
                        >
                           chevron_right
                        </li>
                        <li
                           className={`material-icons next ${
                              currentPage === totalPages ? commons.disabled : ""
                           }`}
                           onClick={currentPage === totalPages ? null : handleLastPage}
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
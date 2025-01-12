import React, { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';
import styles from '../../styles/sub302/sub302.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import axios from 'axios';

function Sub302(props) {
   const { mainTitle, subTitle } = useDocumentTitle();
   const [data, setData] = useState([]); // API 응답 데이터
   const [loading, setLoading] = useState(true); // 로딩 상태
   const [error, setError] = useState(null); // 오류 상태
   const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
   const [itemsPerPage] = useState(10); // 한 페이지에 표시할 항목 수
   const [searchQuery, setSearchQuery] = useState(""); // 검색어
   const [filteredData, setFilteredData] = useState([]); // 검색 결과 데이터
   const API_URL = "http://localhost:8080/api/searchNews";

   const maxPageButtons = 5; // 페이지 버튼 최대 표시 개수

   // 데이터 가져오는 함수
   const getData = async () => {
      try {
         setLoading(true);
         const response = await axios.get(API_URL);
         setData(response.data); // 받아온 데이터를 상태에 저장
         setFilteredData(response.data); // 초기 필터 데이터 설정
         console.log(response.data);
      } catch (err) {
         console.error("데이터 요청 중 오류 발생:", err);
         setError(err.message); // 오류 상태 업데이트
      } finally {
         setLoading(false);
      }
   };

   // 검색어 변경 시 필터링
   const handleSearch = (e) => {
      const query = e.target.value.toLowerCase(); // 검색어를 소문자로 변환
      setSearchQuery(query);
      const filtered = data.filter(
         (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
      setCurrentPage(1); // 검색 시 페이지를 처음으로 초기화
   };

   // 컴포넌트가 처음 렌더링될 때만 데이터 가져오기
   useEffect(() => {
      getData();
   }, []);

   // <b> 태그를 제거하는 함수
   const removeBoldTags = (text) => {
      return text.replace(/<\/?b>/g, '').replace(/&quot;/g, ''); // <b>와 </b> 태그, &quot; 제거
   };

   // 썸네일 이미지가 없을 경우 기본 이미지를 반환하는 함수
   const getThumbnail = (thumbnail) => {
      // 썸네일이 없거나 유효하지 않으면 기본 이미지 사용
      return thumbnail ? thumbnail : "/images/blank_page_image.jpg";
   };

   // 총 페이지 수 계산
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);


   // 현재 페이지의 데이터 가져오기
   const currentData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   // 페이지 이동 함수
   const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
         setCurrentPage(page);
      }
   };

   // 페이지 버튼 범위 계산
   const getPageRange = () => {
      const startPage = Math.max(
         1,
         Math.min(
            currentPage - Math.floor(maxPageButtons / 2),
            totalPages - maxPageButtons + 1
         )
      );
      const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
   };

   // 로딩 중이거나 오류가 있을 때 메시지 출력
   if (loading) return <div className={commons.lodding_page}>
      <div>
         <img src="/images/favicon192.png" alt="로고" />
         <p>로딩 중...</p>
      </div>
   </div>;
   if (error) return <div>오류 발생: {error}</div>;

   return (
      <>
         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>
         
         {/* 검색바 */}
         <ul className={commons.common_search_container}>
            <li>
               <p>검색어 검색</p>
            
               <div className={commons.common_search_div}>
                  <form
                     onSubmit={(e) => {
                        e.preventDefault(); // 폼 기본 동작 방지
                     }}
                  >
                     <input 
                        type="text"
                        placeholder="검색어를 입력해주세요."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <button type="submit" className="material-icons">search</button>
                  </form>
               </div>
            </li>
         </ul>

         <div className={styles.Sub302__content_container}>
            {/* 검색 결과 출력 */}
            {currentData && currentData.length > 0 ? (
               currentData.map((item, index) => (
                  <div
                     className={styles.Sub303__newcontainer}
                     key={index}
                  >
                     {/* 썸네일 이미지 */}
                     <div className={styles.Sub303__newtitle}>
                        <img
                           src={getThumbnail(item.thumbnail)} // 썸네일이 없으면 기본 이미지 사용
                           alt="썸네일"
                           onClick={() => window.open(item.link, "_blank")}
                        />
                     </div>
                     {/* 뉴스 내용 */}
                     <div className={styles.Sub303__newimage}>
                        <div className={styles.Sub303__columns}>
                           <div className={styles.Sub303__writerday}>
                              {/* 작성자 및 날짜 */}
                              <p>{item.date}</p>
                              {/* 제목 */}
                              <p>
                                 <a
                                       href={item.link}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                 >
                                    {removeBoldTags(item.title)}
                                 </a>
                              </p>

                              {/* 설명 */}
                              <div className={styles.Sub303__desribe}>
                                 {removeBoldTags(item.description)}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <p>검색 결과가 없습니다.</p> // 결과가 없으면 메시지 출력
            )}

            {/* 페이지네이션 */}
            <div>
               <ul className={commons.paging_num_ul}>
                  {/* 첫 페이지로 이동 */}
                  <li
                     className={`material-icons prev ${
                        currentPage === 1 ? commons.disabled : ""
                     }`}
                     onClick={() => currentPage !== 1 && goToPage(1)}
                  >
                     keyboard_double_arrow_left
                  </li>

                  {/* 이전 페이지로 이동 */}
                  <li
                     className={`material-icons prev ${
                        currentPage === 1 ? commons.disabled : ""
                     }`}
                     onClick={() => currentPage !== 1 && goToPage(currentPage - 1)}
                  >
                     chevron_left
                  </li>

                  {/* 페이지 번호 */}
                  {getPageRange().map((page) => (
                     <li
                        key={page}
                        className={
                           currentPage === page ? commons.active : ""
                        }
                        onClick={() => goToPage(page)}
                     >
                        {page}
                     </li>
                  ))}

                  {/* 다음 페이지로 이동 */}
                  <li
                     className={`material-icons next ${
                        currentPage === totalPages ? commons.disabled : ""
                     }`}
                     onClick={() =>
                        currentPage !== totalPages &&
                        goToPage(currentPage + 1)
                     }
                  >
                     chevron_right
                  </li>

                  {/* 마지막 페이지로 이동 */}
                  <li
                     className={`material-icons next ${
                        currentPage === totalPages ? commons.disabled : ""
                     }`}
                     onClick={() =>
                        currentPage !== totalPages && goToPage(totalPages)
                     }
                  >
                     keyboard_double_arrow_right
                  </li>
               </ul>
            </div>
         </div>
      </>
   );
}

export default Sub302;
import React, { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';
import styles from '../../styles/faq/faq.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import axios from 'axios';

function FaqList(props) {
   const { mainTitle, subTitle } = useDocumentTitle();

   const [faqData, setFaqData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/fnatbl/list`;

   useEffect(() => {
      const fetchFaqData = async () => {
         try {
            const response = await axios.get(API_URL);
            if (response.data.success && response.data.data) {
               setFaqData(response.data.data);
            } else {
               console.error('Invalid API response structure:', response.data);
            }
         } catch (error) {
            console.error('Error fetching FAQ data:', error);
         }
      };

      fetchFaqData();
   }, [API_URL]);

   const totalPages = Math.ceil(faqData.length / itemsPerPage);
   const paginatedData = faqData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const [activeIndex, setActiveIndex] = useState(0); // 첫 번째 항목 활성화

   const toggleAnswer = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
   };

   const handleFirstPage = () => setCurrentPage(1);
   const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
   const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const handleLastPage = () => setCurrentPage(totalPages);

   const getPageRange = () => {
      const maxButtons = 5; // 최대 버튼 개수
      const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxButtons / 2), totalPages - maxButtons + 1));
      const endPage = Math.min(startPage + maxButtons - 1, totalPages);
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
   };

   const pageRange = getPageRange();

   return (
      <>
         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>
         
         <div className={commons.common__boradsearch__container}>   
            <ul className={commons.common__boradsearch__ul}>
               <li>총 <span>{faqData.length}</span>건</li>
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

         <div className={styles.faq__container}>
            <div className={styles.faq__list}>
               {paginatedData.map((item, index) => (
                  <div key={index} className={styles.faq__item}>
                     <div
                        className={`${styles.faq__question} ${index === 0 ? styles.firstQuestion : ''}`}
                        onClick={() => toggleAnswer(index)}
                     >
                        {item.fna_question}
                        <span className={`material-icons ${activeIndex === index ? styles.rotate : ''}`}>
                           {activeIndex === index ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                     </div>

                     {activeIndex === index && (
                        <div className={`${styles.faq__answer} ${styles.active}`}>
                           {item.fna_answer}
                        </div>
                     )}
                  </div>
               ))}
            </div>

            

            {/* paging 영역 start */}
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
                  {pageRange.map((page) => (
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
            {/* paging 영역 end */}
         </div>
      </>
   );
}

export default FaqList;
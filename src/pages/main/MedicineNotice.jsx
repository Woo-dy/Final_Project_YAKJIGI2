import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MedicineNotice(props) {
   const [notices, setNotices] = useState([]);
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/noticetbl/list`;

   useEffect(() => {
      const fetchNotices = async () => {
         try {
            const response = await axios.get(API_URL);
            if (response.data.success && response.data.data) {
               // 날짜 기준 최신순 정렬
               const sortedNotices = response.data.data.sort(
                  (a, b) => new Date(b.notice_reg_date) - new Date(a.notice_reg_date)
               );
               setNotices(sortedNotices.slice(0, 4)); // 최신 4개만 추출
            } else {
               console.error('Invalid API response:', response.data);
            }
         } catch (error) {
            console.error('Error fetching notices:', error);
         }
      };

      fetchNotices();
   }, [API_URL]);

   return (
      <div className='main__notice__container'>
         <ul>
            <li>
               <h2 className='main__title' >공지사항</h2>
               <h3 className='main__description'>새로운 소식을 만나보세요.</h3>
               <Link to="/noticelist" className='main__btn'>VIEW MORE</Link>
            </li>
            <li>
               <ul className='main__notice__list'>
                  {notices.map((notice, index) => (
                  <li>
                     <Link to={`/noticedetail/${notice.notice_idx}`}>
                        <div>
                           <p className='main__Days'>
                              {new Date(notice.notice_reg_date).getDate().toString().padStart(2, '0')}
                           </p>
                           <em className='main__Year'>
                              {new Date(notice.notice_reg_date).getFullYear()}.{(new Date(notice.notice_reg_date).getMonth() + 1).toString().padStart(2, '0')}
                           </em>
                        </div>
                        <div>
                           <p className='main__title'>{notice.notice_title}</p>
                           <em className='main__descriptions'>
                              {notice.notice_content.length > 50 
                                    ? `${notice.notice_content.substring(0, 50)}...` 
                                    : notice.notice_content}
                           </em>
                        </div>
                     </Link>
                  </li>
                  ))}
               </ul>
            </li>
         </ul>
      </div>
   );
}

export default MedicineNotice;

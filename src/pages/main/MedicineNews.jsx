import { Swiper, SwiperSlide } from 'swiper/react'; // React용 Swiper
import { Autoplay, Pagination, Navigation } from 'swiper/modules'; // 모듈 경로 수정
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';

function MedicineNews(props) {
   const [newsData, setNewsData] = useState([]);
   const [loading, setLoading] = useState(true); // 로딩 상태 추가

   useEffect(() => {
      const fetchNews = async () => {
         try {
            const response = await fetch("http://localhost:8080/api/searchNews");
            const data = await response.json();
            setNewsData(data.slice(0, 7));
         } catch (error) {
            console.error("뉴스 데이터를 가져오는 데 오류가 발생했습니다:", error);
         } finally {
            setLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
         }
      };

      fetchNews();
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
         <div className='Medicinenews__title'>
            <h2 className='main__title'>
               보도자료
            </h2>
            <h3 className='main__description'>
            새로운 소식을 만나보세요.
            </h3>
         </div>
         <div className='Medicinenews__slide'>
            <div className='inner'>
               <Swiper Autoplay
                  modules={[Autoplay, Pagination, Navigation]} // 사용하는 모듈

                  autoplay={{
                     delay: 3000, // 3초마다 슬라이드 변경
                     disableOnInteraction: false, // 사용자 조작 시 자동 재생 유지
                  }}
                  loop={true} // 무한 반복 추가src/pages/main/SwiperSlider.jsx
                  spaceBetween={30} // 슬라이드 간 간격
                  slidesPerView={5} // 한 화면에 보여줄 슬라이드 개
                  navigation={{
                     nextEl: '.swiper-button-next',
                     prevEl: '.swiper-button-prev',
                  }} // 네비게이션 화살표 추가
                  breakpoints={{ 
                     360: { slidesPerView: 1, spaceBetween: 30 },
                     480: { slidesPerView: 2, spaceBetween: 30 },
                     768: { slidesPerView: 3, spaceBetween: 30 },
                     1200: { slidesPerView: 5, spaceBetween: 30 },
                  }} // 반응형
               >
                  {newsData.map((news, index) => (
                     <SwiperSlide key={index}>
                        <Link to={news.link} target="_blank"> {/* 링크를 적절히 수정 */}
                              <div className='Medicinenews__img'>
                                 <img  
                                    alt="이미지" 
                                    src={getThumbnail(news.thumbnail)} // 썸네일이 없으면 기본 이미지 사용
                                    onClick={() => window.open(news.link, "_blank")}
                                 />
                              </div>
                              <div className='Medicinenews__box'>
                                 <h2>{removeBoldTags(news.title)}</h2>
                                 <p>{news.description}</p>
                                 <em>{new Date(news.date).toLocaleDateString()}</em>
                              </div>
                        </Link>
                     </SwiperSlide>
                  ))}
               </Swiper>

               {/* 사용자 정의 버튼 */}
               <div class="swiper-button-prev">
                  <div class="material-icons">arrow_back</div>
               </div>
               <div class="swiper-button-next">
                  <div class="material-icons">arrow_forward</div>
               </div>
            </div>
         </div>
      </>
   );
}

export default MedicineNews;
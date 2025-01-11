import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import styles from '../../styles/mypage/mybasicboardrecordsdetail.module.css';
import boardlog from '../../styles/mypage/mybasicboardlogcommon.module.css';
import MyBasicMenu from '../../components/MyBasicMenu';
import titleMap from '../../titleMap.js'; // titleMap 경로를 실제 경로로 수정하세요.
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import info from '../../styles/mypage/mybasicuserinfo.module.css';

function MyBasicBoardRecordsDetail(props) {
   const titleData = titleMap[`/mybasicboardrecordsdetail`]; // 기본 타이틀 데이터 가져오기

   const BasicBoardCordsListBtn = (event) => {
         event.preventDefault(); // 기본 동작 방지
         window.location.href = '/mybasicboardrecords'; // 클릭 시에만 이동
   };

   const BasicBoardCordsUpdateBtn = (event) => {
         event.preventDefault(); // 기본 동작 방지
         window.location.href = '/mybasicboardrecordsupdate'; // 클릭 시에만 이동
   };

   // 데이터 가져오기
   const location = useLocation();
   const { rx_idx } = location.state; // state에서 rx_idx 값을 가져옵니다.
   const [data, setData] = useState(null);
   const navigate = useNavigate(); // useNavigate 훅 사용
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/boardrecords/detail`; // 상세보기 API URL

   useEffect(() => {
      const getData = async () => {
         try {
            setLoading(true);
            const response = await axios.post(API_URL, { rx_idx }); // rx_idx를 POST 요청으로 전송
            const result = response.data;

            if (!result.success) {
               console.error("Failed to fetch data:", result.message);
               setData(null);
               return;
            }
            setData(result.data);
         } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      getData();
   }, [API_URL, rx_idx]);


   const handleDelete = async () => {
      // 삭제 확인 창
      const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
      if (!confirmDelete) {
          return; // 사용자가 취소하면 함수 종료
      }

      try {
         const response = await fetch(
            `${process.env.REACT_APP_LOCAL_API_BASE_URL}/boardrecords/delete/${rx_idx}`, // rx_idx는 삭제할 항목의 ID
            {
                  method: 'DELETE',
            }
         );

         console.log("response : ", response);

         if (response.ok) {
            // 삭제 성공 시 리다이렉트
            navigate('/mybasicboardrecords');
         } else {
            // 오류 처리
            console.error('삭제 실패');
         }
      } catch (err) {
         console.error('오류 발생:', err);
      }
   };

   if (loading) return <div>Loading...</div>;
   if (error) return <div>Error: {error}</div>;


   return (
         <>
         <div className={commons.container__box__title}>
               <h2 className={commons.main_title}>{titleData?.mainTitle}</h2>
               <p className={commons.sub_title}>{titleData?.subTitle}</p>
         </div>

         {/* 마이 페이지 메뉴 */}
         <MyBasicMenu />

         
         <div className={styles.mybasicboardrecordsdetail_container}>
            {data ? (
                  <div className={styles.left_right_section}>
                  {/* 좌측 : 처방전 이미지 영역 */}
                  <div className={styles.image_section}>
                     <img src="/images/mybasicboardrecords/records_1.jpg" alt="진료 기록 이미지입니다" className={styles.image} />
                  </div>
   
                  {/* 우측 : 정보 텍스트 영역 */}
                  <div className={styles.form_section}>
                     <ul className={boardlog.boardlog__ul}>
                        <li className={boardlog.boardlog__title}>
                           처방 일자
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>{data.rx_date}</p>
                        </li>
                        <li className={boardlog.boardlog__title}>
                           약국명
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>{data.rx_phar_name}</p>
                        </li>
                        <li className={boardlog.boardlog__title}>
                           약사명
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>{data.rx_date}</p>
                        </li>
                        <li className={boardlog.boardlog__title__wide}>
                           처방내역
                        </li>
                        <li className={boardlog.boardlog__contents__wide}>
                           {/* 처방 테이블 영역 */}
                           <div className={styles.form_table_container}>
                              <table className={styles.rx_table}>
                                 <thead>
                                       <tr>
                                             <th>약 이름</th>
                                             <th>복용 방법</th>
                                       </tr>
                                 </thead>
                                 <tbody>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                       <tr>
                                          <td>카페실텐플러스</td>
                                          <td>하루 1번</td>
                                       </tr>
                                 </tbody>
                              </table>
                           </div>
                        </li>
                        <li className={boardlog.boardlog__title}>
                           기타 내용
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>내용 입니다. 내용 입니다. 내용 입니다.</p>
                        </li>
                     </ul>
                  </div>
               </div>
            ) : (
                  <div>데이터가 없습니다.</div>
            )}
            

            <div className={board.board_container}>
               <div className={board.detail_button_box}>
                     <button className={board.cancle} onClick={BasicBoardCordsListBtn}>목록</button>  

                     <span>
                     <button className={board.detail_write} onClick={BasicBoardCordsUpdateBtn}>수정</button>   
                     <button className={board.detail_delete} onClick={handleDelete}>삭제</button>     
                     </span>
               </div>
            </div>
         </div>
         </>
   );
}

export default MyBasicBoardRecordsDetail;
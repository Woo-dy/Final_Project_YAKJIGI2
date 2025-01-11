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
   const { post_num } = location.state; // state에서 post_num 값을 가져옵니다.
   const [data, setData] = useState([]); // 여러 개의 데이터를 저장할 수 있도록 초기값을 빈 배열로 설정
   const [medicationData, setMedicationData] = useState([]); // 약 정보 데이터를 저장할 상태
   const navigate = useNavigate(); // useNavigate 훅 사용
   const [loading, setLoading] = useState(true); // 로딩 상태를 관리
   const [error, setError] = useState(null); // 에러 상태를 관리
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/userrxtbl/detail`; // 상세보기 API URL
   const MEDICATION_JSON_URL = '/data/all_medi_data.json'; // 약 정보 JSON 파일 경로

   useEffect(() => {
      const getData = async () => {
         try {
            setLoading(true); // 데이터 로딩 시작
            const response = await axios.post(API_URL, { post_num }); // API 호출
            const result = response.data; // 응답 데이터

            if (!result.success) {
               console.error("Failed to fetch data:", result.message);
               setData([]); // 실패 시 데이터 초기화
               return;
            }
      
            // 데이터 가공
            const groupedData = {};
            result.data.forEach(item => {
               const { user_idx, rx_date, rx_phar_name, rx_photo, drug_idx } = item;

               // post_num을 기준으로 그룹화
               if (!groupedData[post_num]) {
                  groupedData[post_num] = {
                     user_idx,
                     rx_date,
                     rx_phar_name,
                     rx_photo,
                     drugs: [] // drugs 배열 초기화
                  };
               }
               groupedData[post_num].drugs.push(drug_idx); // drug_idx 추가
            });
      
            setData(Object.values(groupedData)); // 배열로 변환하여 상태에 저장

            // 약 정보 데이터 가져오기
            const medicationResponse = await fetch(MEDICATION_JSON_URL);
            const medicationResult = await medicationResponse.json();
            setMedicationData(medicationResult); // 약 정보 상태에 저장
         } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.response ? err.response.data.message : err.message); // 에러 메시지 설정
         } finally {
            setLoading(false); // 로딩 종료
         }
      };

      getData(); // 데이터 가져오기 함수 호출
   }, [API_URL, post_num]);

   console.log("API Base URL:", `${process.env.REACT_APP_LOCAL_API_BASE_URL}/userrxtbl/delete/${post_num}`);

   // 매칭된 약 정보 찾기
   const matchedData = data.map(item => {
      const matchedMedications = item.drugs.map(drug_idx => {
         const medication = medicationData.find(medication => medication.item_seq === drug_idx); // drug_idx에 해당하는 약 정보 찾기
         if (medication) {
            console.log(`Matched medication for drug_idx ${drug_idx}:`, medication); // 디버깅 로그
   
            // drug_idx에 해당하는 DB 정보 출력
            const dbInfo = medicationData.find(med => med.item_seq === drug_idx);
            if (dbInfo) {
               console.log(`DB info for drug_idx ${drug_idx}:`, dbInfo); // DB 정보 출력
            } else {
               console.warn(`No DB info found for drug_idx ${drug_idx}`); // DB 정보가 없을 경우 경고
            }
         } else {
            console.warn(`No medication found for drug_idx ${drug_idx}`); // 디버깅 로그
         }
         return medication; // 매칭된 약 정보 반환
      }).filter(Boolean); // 유효한 약 정보만 필터링
   
      return {
         ...item,
         matchedMedications // 매칭된 약 정보를 포함한 새로운 객체 반환
      };
   });

   // matchedData를 사용하여 UI에 표시

   const handleDelete = async () => {
      const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
      if (!confirmDelete) {
          return; // 사용자가 취소하면 함수 종료
      }

      try {
            const response = await fetch(
               `${process.env.REACT_APP_LOCAL_API_BASE_URL}/boardrecords/delete/${post_num}`,
               {
                     method: 'DELETE',
                     headers: {
                        'Content-Type': 'application/json',
                     },
               }
            );

            if (response.ok) {
               // 삭제 성공 시 리다이렉트
               navigate('/mybasicboardrecords');
            } else {
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
            {matchedData.length > 0 ? (
               matchedData.map((item, index) => (
                  <div className={styles.left_right_section}>
                  {/* 좌측 : 처방전 이미지 영역 */}
                  <div key={index} className={styles.image_section}>
                     <img src="/images/mybasicboardrecords/records_1.jpg" alt="진료 기록 이미지입니다" className={styles.image} />
                  </div>
   
                  {/* 우측 : 정보 텍스트 영역 */}
                  <div className={styles.form_section}>
                     <ul className={boardlog.boardlog__ul}>
                        <li className={boardlog.boardlog__title}>
                           처방 일자
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>{item.rx_date}</p>
                        </li>
                        <li className={boardlog.boardlog__title}>
                           약국명
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>{item.rx_phar_name}</p>
                        </li>
                        <li className={boardlog.boardlog__title}>
                           약사명
                        </li>
                        <li className={boardlog.boardlog__contents}>
                           <p>{item.rx_date}</p>
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
                                    {item.matchedMedications.length > 0 ? (
                                       item.matchedMedications.map((medication, medIndex) => (
                                          medication ? ( // medication이 유효한 경우에만 출력
                                             <tr key={medIndex}>
                                                <td>{medication.item_name}</td>
                                                <td>{medication.rx_other ? medication.rx_other : '정보 없음'}</td> {/* 복용 방법 */}
                                             </tr>
                                          ) : null // medication이 유효하지 않으면 null 반환
                                       ))
                                    ) : (
                                       <tr>
                                          <td colSpan="2">약품 정보가 없습니다.</td>
                                       </tr>
                                    )}
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
               ))
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
import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import styles from '../../styles/mypage/mybasicboardrecords.module.css';
import MyBasicMenu from '../../components/MyBasicMenu';
import { Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import info from '../../styles/mypage/mybasicuserinfo.module.css';

function MyBasicBoardRecords(props) {
   const { mainTitle, subTitle } = useDocumentTitle();  

   
   const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

   const basicRecordsDetailBtn = async (rx_idx) => {
      try {
         const response = await axios.post('http://localhost:8080/boardrecords/detail', { rx_idx });
         // 응답에 따라 상세보기 페이지로 이동
         if (response.data && response.data.data && response.data.data.rx_idx) {
            // navigate를 사용하여 상세보기 페이지로 이동
            navigate('/mybasicboardrecordsdetail', { state: { rx_idx: response.data.data.rx_idx } });
         } else {
            console.error("ID not found in response:", response.data);
         }
      } catch (error) {
         console.error("Error navigating to detail:", error);
      }
   };

   const basicRecordsWriteBtn = (event) => {
      event.preventDefault(); // 기본 동작 방지
      window.location.href = '/mybasicboardrecordswrite'; // 클릭 시에만 이동
   };

   // 더미 데이터 ~ 추후 실제 DB로 대체
   const [list, setList] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/boardrecords/list`;

   console.log("API_URL : " + API_URL); // API_URL이 올바르게 설정되었는지 확인하기 위해 콘솔에 출력 

   // 데이터 가져오기
   useEffect(() => {
      const getData = async () => {
         try {
            setLoading(true);
            const response = await axios.get(API_URL);
            const data = response.data; // API에서 반환하는 데이터 구조에 따라 수정 필요
            console.log("data : ", data); // 데이터의 형식을 확인

            // 데이터가 배열인지 확인
            if (!Array.isArray(data.data)) { // data.data로 수정
                  console.error("Expected an array but got:", data);
                  setList([]); // 빈 배열로 설정
                  return;
            }
            setList(data.data); // data.data로 수정
         } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      getData();
   }, [API_URL]); // API_URL이 변경될 때마다 호출


   // 로딩 중 화면
   if (loading) {
      return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
   }

   // 에러 발생 시 화면
   if (error) {
      return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</div>;
   }


   return (
      <>
         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>

         {/* 마이 페이지 메뉴 */}
         <MyBasicMenu />
         
         <section className={styles.mybasicboardrecords_container}>
            <div className={styles.records_grid}>
               {loading ? (
                  <p>Loading...</p>
               ) : error ? (
                  <p>Error: {error}</p>
               ) : list.length > 0 ? ( // list가 빈 배열이 아닐 경우
                  list.map((item, index) => (
                     <div className={styles.records_item} key={item.id || index} onClick={() => basicRecordsDetailBtn(item.rx_idx)}>
                           <img
                              src={item.rx_photo}
                              alt={`Record from ${item.date}`}
                              className={styles.record_img}
                           />
                           <div className={styles.records_text}>
                              <p>{item.rx_date}</p>
                              <p>{item.rx_phar_name}</p>
                           </div>
                     </div>
                  ))
               ) : (
                  <p>No data available</p>
               )}
            </div>
            

            <div className={board.board_button_box}>
               <ul className={board.two}>
                  <li>
                  </li>
                  <li>
                     <Link onClick={basicRecordsWriteBtn}>글쓰기</Link>
                  </li>
               </ul>
            </div>

               <ul className={styles.paging_num_ul}>
                  <li className={`material-icons ${styles.icon}`}>keyboard_double_arrow_left</li>
                  <li className={`material-icons ${styles.icon}`}>chevron_left</li>
                  <li className="active">1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li>5</li>
                  <li className={`material-icons ${styles.icon}`}>chevron_right</li>
                  <li className={`material-icons ${styles.icon}`}>keyboard_double_arrow_right</li>
               </ul>
         </section>
      </>
   );
}

export default MyBasicBoardRecords;
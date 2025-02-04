import React, { useState } from 'react';
import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import styles from '../../styles/mypage/mymain.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Link, useLocation } from 'react-router-dom';
import MyBasicMenu from '../../components/MyBasicMenu';

function MyBasicBoardCounselWrite(props) {
   const { mainTitle, subTitle } = useDocumentTitle();
   const [fileName, setFileName] = useState('');
   const location = useLocation();

   const handleFileChange = (event) => {
      const file = event.target.files[0]; // 선택된 파일

      if (file) {
         setFileName(file.name); // 파일 이름을 상태에 저장
      }
   };

   const proCounselListBtn = (event) => {
      event.preventDefault(); // 기본 동작 방지
      window.location.href = '/myproboardcounsel'; // 클릭 시에만 이동
   };
   
   // 한 페이지 내에 페이지가 여러개 추가될 시 버튼 활성화 
   const activeClass = ['/mybasicboardcounsel',
                        '/mybasicboardcounselwrite',
                        '/mybasicboardcounselupdate',
                        '/mybasicboardcounseldetail' ].includes(location.pathname) ? 
                        styles.boardActive : '';

   return (
      <>
         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>
         </div>

         {/* 마이 페이지 메뉴 */}
         <MyBasicMenu />

         <div className={styles.my__board__tabmenu}>
            <ul>
               <li className={['/mybasicboardcounsel', 
                              '/mybasicboardcounselwrite',
                              '/mybasicboardcounselupdate',
                              '/mybasicboardcounseldetail'
                  ].includes(location.pathname) ? activeClass : ''}
               >
                  <Link to="/mybasicboardcounsel">
                     전문가와의 상담
                  </Link>
               </li>
               <li className={`${styles.link} ${location.pathname === '/mybasicboardinquiry' ? styles.boardActive : ''}`}>
                  <Link to="/mybasicboardinquiry">운영진에게 문의</Link>
               </li>
            </ul>
         </div>

         <div className={board.board_container}>
            <form method="post" encType="multipart/form-data">
               <div className={board.board_content_box}>
                  <ul>
                     <li className={board.row}>
                        <div className={board.board_label}>옵션</div>
                        <div className={board.board_input}>
                           <label>
                              <input type="checkbox" name="n_chk" value="check" /> 공지
                           </label>
                        </div>
                     </li>
                     <li className={board.row}>
                        <div className={board.board_label}>카테고리</div>
                        <div className={board.board_input}>
                           <select name="n_opt" className={board.board_select} required>
                              <option value="공원" selected>공원</option>
                              <option value="가로수길">가로수길</option>
                              <option value="보호수">보호수</option>
                              <option value="녹지행사">녹지행사</option>
                           </select>
                        </div>
                     </li>
                     <li className={board.row}>
                        <div className={board.board_label}>제목</div>
                        <div className={board.board_input}>
                           <input type="text" name="n_tle" className={board.in_title} placeholder="제목을 입력해주세요." required />
                        </div>
                     </li>
                     <li className={board.top}>
                        <div className={board.board_label}>내용</div>
                        <div className={board.board_input}>
                           에디터 추후 적용
                        </div>
                     </li>
                     <li className={board.row}>
                        <div className={board.board_label}>첨부파일</div>
                           <div className={board.board_input}>
                              <div className={commons.filebox}>
                                    <input
                                       className={commons.uploadName}
                                       value={fileName}
                                       placeholder="파일찾기를 클릭해서 첨부파일을 등록해주세요."
                                       readOnly
                                    />
                                    <label htmlFor="file">파일찾기</label>
                                    <input
                                       type="file"
                                       id="file"
                                       name="file_name"
                                       onChange={handleFileChange} // 파일 변경 시 핸들러 호출
                                    />
                              </div>
                        </div>
                     </li>
                  </ul>
            </div>

            <div className={board.write_button_box}>                
                  <div>
                     {/* <input type="hidden" name="cPage" value="${cPage}" /> 
                     <input type="hidden" name="a_idx" value="admin" />  */}
                     <button className={board.board_write}>작성완료</button>    
                     <button className={board.board_cancle} onClick={proCounselListBtn}>목록</button>    
                  </div>
            </div>
            </form>
         </div>
      </>
   );
}

export default MyBasicBoardCounselWrite;
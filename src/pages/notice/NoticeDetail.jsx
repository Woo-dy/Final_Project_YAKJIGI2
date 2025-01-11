import React, { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';
import board from '../../styles/boardcommon.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import titleMap from '../../titleMap';

function NoticeDetail(props) {
   const [post, setPost] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null); // 에러 상태 추가
   const { noticeId } = useParams(); // URL에서 ID를 가져옴
   const API_URL = `${process.env.REACT_APP_LOCAL_API_BASE_URL}/noticetbl/detail/${noticeId}`;
   const navigate = useNavigate(); // useNavigate 훅 사용
   const titleInfo = titleMap['/noticedetail/:id']; // 동적 경로에 대한 타이틀 가져오기

   useEffect(() => {
      const fetchNotice = async () => {
         try {
            const response = await axios.get(API_URL);
            if (response.data.success && response.data.data) {
               setPost(response.data.data);
            } else {
               console.error('Invalid API response structure:', response.data);
            }
         } catch (error) {
            console.error('Error fetching notice:', error);
            setError('Failed to fetch notice. Please try again later.'); // 에러 메시지 설정
         } finally {
            setLoading(false);
         }
      };

      fetchNotice();
   }, [API_URL]); // id를 의존성으로 추가

   const noticeListBtn = (event) => {
      event.preventDefault(); // 기본 동작 방지
      navigate('/noticelist'); // React Router의 navigate 사용
   };

   const noticeUpdateBtn = (event) => {
      event.preventDefault(); // 기본 동작 방지
      navigate('/noticeupdate'); // React Router의 navigate 사용
   };

   if (loading) {
      return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
   }

   if (error) {
      return <div>{error}</div>; // 에러 발생 시 표시할 내용
   }


   return (
      <>
         <div className={commons.container__box__title}>
            <h2 className={commons.main_title}>{titleInfo.mainTitle}</h2>
            <p className={commons.sub_title}>{titleInfo.subTitle}</p>
         </div>
         <div className={board.board_container}>
            {post && (
            <div className={board.board_content}>
               <ul>
                  <li>
                     <h2 className={board.board_title}>{post.notice_title}</h2>
                     <div className={board.board_tt}>
                        <ul>
                           <li>
                              <span className={board.board_sub_title}>작성자</span>
                              <span className={board.board_sub_cont}>{post.author}</span>
                           </li>
                           <li>
                              <span className={board.board_sub_title}>작성일</span>
                              <span className={board.board_sub_cont}>{post.notice_reg_date}</span>
                           </li>
                           <li>
                              <span className={board.board_sub_title}>조회수</span>
                              <span className={board.board_sub_cont}>{post.views}</span>
                           </li>
                        </ul>
                     </div>
                  </li>
               </ul>
               <ul>
                  <li className={board.bodyCont}>
                     {post.board_content || "게시글 내용이 없습니다."}
                  </li>
               </ul>
               <ul>
                  <li>
                     <span>등록된 첨부파일이 없습니다.</span>

                     <p className={board.board_attachment_name}>첨부파일</p>
                     <ul className={board.board_attachment}>
                        <li className={board.img_box}>
                           <Link href="#">
                              <img src="/images/length1.jpg" alt='이미지'/>
                           </Link>
                        </li>
                        <li>
                           <p className={board.img_name}>
                              <span>파일명</span> {post.fileName}
                           </p>
                           <p>
                              <Link href="#" className={board.img_down}>다운로드</Link>
                           </p>
                        </li>
                     </ul>
                  </li>
               </ul>
            </div>
            )}
            
            {/* 댓글 출력 창 */}
            <div className={board.board_comment_list_del}>
               <ul>
                  <li>
                     <p className={board.board_cmt_content}>삭제된 댓글 입니다.</p>
                  </li>
               </ul>
            </div>

            <form method="post">
               <div className={board.board_comment_list}>
                  <ul>
                     <li>
                        <img src="/images/board/profile.png" alt="profile" />
                     </li>
                     <li>
                        <p className={board.cmt_id}>아이디 <span className={board.cmt_update}>(수정됨)</span> <span className={board.cmt_name}>작성자</span></p>
                        <p className={board.board_cmt_content}>asdsdsda</p>
                        <p className={board.board_cmt_date}>asdsdasd</p>
                        
                        {/* 실제는 로그인 성공 후 관리자이거나 글쓴 본인인 경우만 삭제 가능 */}
                        <div className={board.btn_contents}>
                           <button className={board.update_btn}>수정</button>
                           <button className={board.delete_btn} onclick="move_comment_delete(this.form)">삭제</button>
                        </div>
                     </li>
                  </ul>
                  {/* 컨트롤러 가서 DB 삭제 후 다시 이곳으로 와야 한다. (나중에 ajax로 변경하자) */}
                  {/* <input type="hidden" name="idxc_idx" value="${k.idxc_idx}" />
                  <input type="hidden" name="c_ref" value="${k.c_ref}" />
                  <input type="hidden" name="idxn_idx" value="${k.c_ref}" />
                  <input type="hidden" name="cPage" value="${cPage}" /> */}
               </div>
            </form>
            
            {/* 댓글 입력 창 */}
            <div className={board.comment_container}>
               <form action="/comment_insert" method="post">
                  <fieldset>
                     {/* 아이디 number */}
                     <input type="hidden" name="u_idx" value="1" />
                     
                     <p className={board.board_cmt_id}>아이디 불러오기</p>
                     <div className={board.board_insert_comment}>
                        <textarea rows="3" cols="40" name="c_con" placeholder="댓글을 남겨보세요." required></textarea>
                        {/* 댓글 저장 시 어떤 댓글이 원글인지 저장해야 한다. */}
                        {/* <input type="hidden" name="idxn_idx" value="${gvo.idxn_idx}" />
                        <input type="hidden" name="cPage" value="${cPage}" />
                        <input type="hidden" name="c_out" value="0" />
                        <input type="hidden" name="c_bor" value="notice" /> */}
                        <input type="submit" className={board.insert_btn} value="등록" />
                     </div>
                  </fieldset>
               </form>
            </div>
            
            
            <div>               
               <div className={board.detail_button_box}>
                  <button className={board.cancle} onClick={noticeListBtn}>목록</button>  
                  <form method="post">  
                     {/* <input type="hidden" name="cPage" value="${cPage}" /> 
                     <input type="hidden" name="idxn_idx" value="${gvo.idxn_idx}" /> 
                     <input type="hidden" name="a_idx" value="${gvo.a_idx}" />  */}
                  </form>

                  <span>
                     <button className={board.detail_write} onClick={noticeUpdateBtn}>수정</button>   
                     <button className={board.detail_delete}>삭제</button>     
                  </span>
               </div>
            </div>
         </div>
      </>
   );
}

export default NoticeDetail;
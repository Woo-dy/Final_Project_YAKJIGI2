import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/main/menuMobile.css";
import SubTopImages from './SubTopImages';


function Header(props) {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isHovered, setIsHovered] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [timeoutId, setTimeoutId] = useState(null);

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   // 마우스 오버 이벤트 핸들러
   const handleMouseEnter = () => {
      setIsHovered(true);
   };
   
   const handleMouseLeave = () => {
      setIsHovered(false);
   };

   const handleLinkClick = () => {
      setIsMenuOpen(false); // 메뉴를 닫기 위해 상태 업데이트
   };   

   const showTopArea = () => {
      // Top area를 보여주는 로직
      console.log('Top area shown');
   };

   const hideTopArea = () => {
         // Top area를 숨기는 로직
         console.log('Top area hidden');
   };

   const handleMouseEnterMenubar = () => {
      setIsHovered(true);
      showTopArea();
   };

   const handleMouseEnterLink = () => {
      setIsHovered(true);
   };

   const handleMouseLeaveLink = () => {
      // Link에서 마우스가 나갈 때, 메뉴가 활성화되어 있지 않으면 isHovered를 false로 설정
      if (!isHovered) {
         setIsHovered(false);
      }
   };

   const handleMouseLeaveMenubar = () => {
      // menuItem에 마우스가 올라가 있는지 확인 후 상태 변경
      if (timeoutId) {
         clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
         setIsHovered(false);
         hideTopArea();
      }, 100); // 100ms 후에 상태 변경
      setTimeoutId(id);
   };

   const handleMouseEnterMenuItem = () => {
      setIsHovered(true);
   };

   useEffect(() => {
      // 메뉴가 열릴 때 스크롤 방지
      if (isMenuOpen) {
         document.body.style.overflow = 'hidden';
         document.body.style.position = 'fixed'; // 스크롤 바를 숨기기 위해 position을 fixed로 설정
         document.body.style.width = '100%'; // width를 100%로 설정하여 레이아웃 유지
      } else {
         document.body.style.overflow = 'auto'; // 기본값으로 되돌리기
         document.body.style.position = 'static'; // 원래 position으로 되돌리기
      }


      const handleScroll = () => {
         if (window.scrollY > 60) {
            setIsScrolled(true);
         } else {
            setIsScrolled(false);
         }
      };

      window.addEventListener('scroll', handleScroll);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
         window.removeEventListener('scroll', handleScroll);

         document.body.style.overflow = 'auto';
         document.body.style.position = 'static';
      };
   }, [isMenuOpen]);

   return (
      <>
      <div className='main__wrap'>
         <header id="header" className={`wrap ${isScrolled ? 'bg_on' : ''}`}>
            <div className={`${isScrolled ? 'main__global__menu__none' : 'main__global__menu'}`}>
               <ul>
                  <li>
                     <Link to="/login">로그인</Link>
                     <Link to="/joinselect">회원가입</Link>
                     <Link to="/mybasicmain">마이(basic)</Link>
                     <Link to="/mypromain">마이(pro)</Link>
                     <Link to="/noticelist">공지사항</Link>
                  </li>
               </ul>
            </div>
            <div className="header_line">
               <div id="gnb" className="clear logo_menu_bar">
                  <div className="top_menu_bat">
                     <div className="logo_container">
                        <Link to="/">
                           <h1 id="logo_img" className={`logo_sub ${isScrolled || isHovered ? 'logo_sub_b2' : ''}`}>
                        </h1>
                        </Link>
                     </div>
                     <div id="menubar2" className={`menubar2 ${isHovered ? 'on' : ''}`}
                        
                           onMouseEnter={handleMouseEnterMenubar}
                           onMouseLeave={handleMouseLeaveMenubar}
                        >
                           <ul id="menuItem" className='menuItem'>
                              <li>
                                 <Link
                                    className={`${isScrolled ? 'black2' : ''} ${isHovered ? 'black2' : ''}`}
                                    onMouseEnter={handleMouseEnterLink}
                                    onMouseLeave={handleMouseLeaveLink}
                                 >의약품이란?</Link>
                                 <ul onMouseEnter={handleMouseEnterMenuItem}>
                                    <li className="menuItem2_ul">
                                       <div className="clearfix">
                                          <div className="menu_layout">
                                                <div className="menu_title">
                                                   <p>의약품이란?</p>
                                                   <em>
                                                      의약품은 인간의 질병을 예방하고 치료하며 건강을 증진하기 위해 사용하는 화학적, 생물학적 물질입니다. 
                                                   </em>
                                                   <div className="button">
                                                      <Link to="/sub101">View More</Link>
                                                   </div>
                                                </div>
                                                <div className="menu_01_img">
                                                   <div>
                                                      <img src="/images/sub/sub_menu_1.jpg" alt="main_slide_1" />
                                                   </div>
                                                </div>
                                                <div className="menu_01">
                                                   <p className="menu_01_p">
                                                      <Link to="/sub101">
                                                         의약품의 정의
                                                      </Link>
                                                   </p>
                                                   <p className="menu_02_p">
                                                      <Link to="/sub102">
                                                         의약품의 종류
                                                      </Link>
                                                   </p>
                                                   <p className="menu_03_p">
                                                      <Link to="/sub103">
                                                         의약품의 허가과정
                                                      </Link>
                                                   </p>
                                                   <p className="menu_04_p">
                                                      <Link to="/sub104">
                                                         신약과 제네릭
                                                      </Link>
                                                   </p>
                                                   <p className="menu_05_p">
                                                      <Link to="/sub105">
                                                         의약품 관련 법령
                                                      </Link>
                                                   </p>
                                                </div>
                                          </div>
                                       </div>
                                    </li>
                                    <li></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link 
                                    className={`${isScrolled ? 'black2' : ''} ${isHovered ? 'black2' : ''}`}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                 >안전한 의약생활</Link>
                                 <ul onMouseEnter={handleMouseEnterMenuItem}>
                                    <li className="menuItem2_ul">
                                       <div className="clearfix">
                                          <div className="menu_layout">
                                                <div className="menu_title">
                                                   <p>안전한 의약생활</p>
                                                   <em>
                                                      안전한 의약생활은 올바른 약물 사용과 관리로 건강을 지키는 중요한 방법입니다. 의약품 복용 시에는 반드시 의사의 처방을 따르고, 자가 진단을 피해야 합니다.
                                                   </em>
                                                   <div className="button">
                                                      <Link to="/sub201">View More</Link>
                                                   </div>
                                                </div>
                                                <div className="menu_01_img">
                                                   <div>
                                                      <img src="/images/sub/sub_menu_2.jpg" alt="main_slide_1" />
                                                   </div>
                                                </div>
                                                <div className="menu_01">
                                                   <p className="menu_01_p">
                                                      <Link to="/sub201">의약품 검색하기</Link>
                                                   </p>
                                                   <p className="menu_02_p">
                                                      <Link to="/sub202">부작용 검색하기</Link>
                                                   </p>
                                                   <p className="menu_03_p">
                                                      <Link to="/sub203">병용금기 검색하기</Link>
                                                   </p>
                                                </div>
                                          </div>
                                       </div>
                                    </li>
                                    <li></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link  
                                    className={`${isScrolled ? 'black2' : ''} ${isHovered ? 'black2' : ''}`}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                 >생활 속 의약</Link>
                                 <ul onMouseEnter={handleMouseEnterMenuItem}>
                                       <li className="menuItem2_ul">
                                          <div className="clearfix">
                                             <div className="menu_layout">
                                                   <div className="menu_title">
                                                      <p>생활 속 의약</p>
                                                      <em>
                                                         생활 속 의약은 건강을 지키기 위한 약물 사용과 관리의 중요성을 강조합니다. 올바른 정보 습득과 건강한 생활 습관 유지가 필요합니다.
                                                      </em>
                                                      <div className="button">
                                                         <Link to="/sub301">View More</Link>
                                                      </div>
                                                   </div>
                                                   <div className="menu_01_img">
                                                      <div>
                                                         <img  src="/images/sub/sub_menu_3.jpg" alt="main_slide_1" />
                                                      </div>
                                                   </div>
                                                   <div className="menu_01">
                                                      <p className="menu_01_p">
                                                         <Link to="/sub301">약국 찾아보기</Link>
                                                      </p>
                                                      <p className="menu_02_p">
                                                         <Link to="/sub302">보도자료 찾아보기</Link>
                                                      </p>
                                                      <p className="menu_03_p">
                                                         <Link to="/sub303">폐의약품 수거함 찾아보기</Link>
                                                      </p>
                                                   </div>
                                             </div>
                                          </div>
                                       </li>
                                       <li></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link 
                                    className={`${isScrolled ? 'black2' : ''} ${isHovered ? 'black2' : ''}`}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                 >커뮤니티</Link>
                                 <ul onMouseEnter={handleMouseEnterMenuItem}>
                                    <li className="menuItem2_ul">
                                       <div className="clearfix">
                                          <div className="menu_layout">
                                                <div className="menu_title">
                                                   <p>커뮤니티</p>
                                                   <em>
                                                      환자와 의료 전문가가 소통하며 의약 정보와 경험을 공유하고, 다양한 질병에 대한 이해를 높여 건강한 삶을 추구하는 플랫폼입니다.
                                                   </em>
                                                   <div className="button">
                                                      <Link to="/noticelist">View More</Link>
                                                   </div>
                                                </div>
                                                <div className="menu_01_img">
                                                   <div>
                                                      <img  src="/images/sub/sub_menu_4.jpg" alt="main_slide_1" />
                                                   </div>
                                                </div>
                                                <div className="menu_01">
                                                   <p className="menu_01_p">
                                                      <Link to="/noticelist">공지사항</Link>
                                                   </p>
                                                   <p className="menu_02_p">
                                                      <Link to="/faqlist">자주묻는 질문</Link>
                                                   </p>
                                                   <p className="menu_03_p">
                                                      <Link to="/qnalist">전문가와의 상담</Link>
                                                   </p>
                                                   <p className="menu_04_p">
                                                      <Link to="/minquirylist">운영진에게 문의</Link>
                                                   </p>
                                                </div>
                                          </div>
                                       </div>
                                    </li>
                                    <li></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link to="#">개인정보 처리방침</Link>
                                 <ul>
                                    <li className="menuItem2_ul">
                                       <div className="clearfix">
                                          <div className="menu_layout">
                                                <div className="menu_title">
                                                   <p>개인정보 처리방침</p>
                                                   <em></em>
                                                   <div className="button">
                                                      <Link>View More</Link>
                                                   </div>
                                                </div>
                                                <div className="menu_01_img">
                                                   <div>
                                                   </div>
                                                </div>
                                                <div className="menu_01">
                                                   <p className="menu_01_p">개인정보 처리방침</p>
                                                </div>
                                          </div>
                                       </div>
                                    </li>
                                    <li></li>
                                 </ul>
                              </li>
                           </ul>
                     </div>
                     <div className="popup_slide">
                           <div className="hamberger_menu">
                              <button id="mBtn" className={`mBtn ${isScrolled ? 'mBtn_b' : ''} ${isHovered ? 'mBtn_b' : ''}`} onClick={toggleMenu}>
                                 {isMenuOpen ? 
                                 <span class="material-symbols-outlined">
                                    close
                                 </span> 
                                 : <span class="material-symbols-outlined">
                                    menu
                                 </span>
                                 }
                              </button>
                           </div>
                     </div>
                  </div>
               </div>
            </div>
         </header> 

         <nav className={isMenuOpen ? 'mNav on' : 'mNav'}>
            <div className="mNav_menu">
                  <div className="closeBtn"> 
                     {/* 닫기 버튼 */}
                     <button onClick={toggleMenu}>
                        <span class="material-symbols-outlined">
                           close
                        </span>
                     </button>
                  </div>
            </div>
            <div className="flexBox">
                  <div className="bg"><img src="./images/mobile_menu_bg.jpg" alt="main_slide_1" /></div>
                  <div className="clear2">
                     <div id="nav">
                        <div className="flexBox">
                              <ul className="menu depth1 flexBox2">
                                 <li>
                                    <Link to="#" className="slide">의약품이란?</Link>
                                    <ul className="sub slideContent">
                                       <li>
                                          <Link to="/sub101" onClick={handleLinkClick}>의약품의 정의</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub102" onClick={handleLinkClick}>의약품의 종류</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub103" onClick={handleLinkClick}>의약품의 허가과정</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub104" onClick={handleLinkClick}>신약과 제네릭</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub105" onClick={handleLinkClick}>의약품의 관련 법령</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li>
                                    <Link to="#" className="slide">안전한 의약생활</Link>
                                    <ul className="sub slideContent">
                                       <li>
                                          <Link to="/sub201" onClick={handleLinkClick}>안전한 의약생활</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub202" onClick={handleLinkClick}>부작용 검색하기</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub203" onClick={handleLinkClick}>병용금기 검색하기</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li>
                                    <Link to="#" className="slide">생활 속 의약</Link>
                                    <ul className="sub slideContent">
                                       <li>
                                          <Link to="/sub301" onClick={handleLinkClick}>약국 찾아보기</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub302" onClick={handleLinkClick}>보도자료 찾아보기</Link>
                                       </li>
                                       <li>
                                          <Link to="/sub303" onClick={handleLinkClick}>폐의약품 수거함 찾아보기</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li>
                                    <Link to="#" className="slide">커뮤니티</Link>
                                    <ul className="sub slideContent">
                                       <li>
                                          <Link to="/noticelist" onClick={handleLinkClick}>공지사항</Link>
                                       </li>
                                       <li>
                                          <Link to="/faqlist" onClick={handleLinkClick}>자주묻는 질문</Link>
                                       </li>
                                       <li>
                                          <Link to="/qnalist" onClick={handleLinkClick}>전문가와의 상담</Link>
                                       </li>
                                       <li>
                                          <Link to="/minquirylist" onClick={handleLinkClick}>운영진에게 문의</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li>
                                    <Link to="#" class="slide">개인정보 처리방침</Link>
                                    <ul class="sub slideContent">
                                       <li>
                                          <Link to="#">개인정보 처리방침</Link>
                                       </li>
                                    </ul>
                                 </li>
                              </ul>
                        </div>
                     </div>
                  </div>
            </div>
         </nav>  
      </div>

      {/* 서브 페이지 이미지 */}
      <SubTopImages />
      </>
   );
}

export default Header;
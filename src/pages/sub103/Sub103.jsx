import React, { useEffect, useState } from 'react';

import commons from '../../styles/common.module.css';
import styles from '../../styles/sub103/sub103.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function Sub103(props) {
   const { mainTitle, subTitle } = useDocumentTitle();

   const [imageSrc, setImageSrc] = useState("");

   useEffect(() => {
      const updateImage = () => {
         if (window.innerWidth < 768) {
            // 모바일
            setImageSrc("/images/sub103/sub1_3_mb.png");
         } else {
            // PC
            setImageSrc("/images/sub103/sub1_3_pc.png");
         }
      };

      // 초기 이미지 설정
      updateImage();

      // 윈도우 크기 변경 시 이미지 업데이트
      window.addEventListener("resize", updateImage);
      return () => window.removeEventListener("resize", updateImage);
   }, []);


   return (
      <>
         <div className={commons.container__box}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>

            <p className={styles.contents_description}>
            의약품의 허가는 안전성, 효능, 품질을 보장하기 위한 필수적인 절차로, 환자와 소비자의 건강을 보호하는 데 중점을 둡니다. 이 과정에서 임상시험은 중요한 역할을 하며, 일반적으로 1상, 2상, 3상으로 나뉘어 약물의 안전성과 효능을 단계별로 평가합니다. 각 단계에서 수집된 데이터는 규제 기관에 의해 면밀히 검토되며, 대한민국의 경우 식품의약품안전처가 이러한 역할을 수행합니다.
            <br />
            <br />
            허가 과정에서는 윤리적 고려사항도 매우 중요합니다. 임상시험에 참여하는 자원자의 권리를 보호하고, 그들의 안전을 최우선으로 하는 것이 필수적입니다. 연구자들은 자발적인 동의를 얻고, 시험의 위험성과 이점을 충분히 설명해야 하며, 결과는 투명하게 공개되어야 합니다.
            <br />
            <br />
            최근에는 글로벌 의약품 허가의 동향이 통합되고 있으며, 여러 국가에서 기준과 절차를 조화시키려는 노력이 진행되고 있습니다. 이러한 국제적인 협력은 제약 회사들이 다양한 시장에 신속하게 진입할 수 있도록 돕고, 환자에게 더 나은 치료 옵션을 제공하는 데 기여하고 있습니다. 의약품의 허가 과정은 단순한 절차를 넘어, 공공의 건강과 신뢰를 구축하는 데 중요한 역할을 하고 있습니다.
            </p>
            <div className={styles.sub103__images__content}>
               <img src={imageSrc} alt="main_slide_1" />
            </div>
         </div>

      </>
   );
}

export default Sub103;
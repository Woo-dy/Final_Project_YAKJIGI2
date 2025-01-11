import React from 'react';

import commons from '../../styles/common.module.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import styles from '../../styles/sub102/sub102.module.css';

function Sub102(props) {
   const { mainTitle, subTitle } = useDocumentTitle();

   return (
      <>
         <div className={commons.container__box}>
            <h2 className={commons.main_title}>{mainTitle}</h2>
            <p className={commons.sub_title}>{subTitle}</p>

            <p className={styles.contents_description}>
            의약품은 그 종류에 따라 여러 가지로 나뉘며, 각기 다른 용도와 효과를 가지고 있습니다. 일반적으로 의약품은 전문의약품과 일반의약품으로 구분됩니다.
            <br />
            <br />
            전문의약품은 의사의 처방이 필요한 약물로, 주로 중증 질환이나 만성 질환의 치료에 사용됩니다. 이러한 약물은 특정 질병에 대한 전문적인 관리가 필요하며, 환자의 상태에 따라 용량과 복용 방법이 달라집니다. 예를 들어, 항생제는 감염을 치료하는 데 사용되며, 항암제는 암세포의 성장을 억제하는 데 중요한 역할을 합니다. 전문의약품은 부작용이나 상호작용이 있을 수 있으므로, 반드시 의사의 지시에 따라 사용해야 하며, 환자의 건강 회복에 필수적입니다.
            <br />
            <br />
            반면, 일반의약품은 약국에서 처방 없이 구매할 수 있는 약물로, 경미한 증상이나 일상적인 건강 문제를 해결하는 데 사용됩니다. 일반의약품의 예로는 진통제, 감기약, 소화제 등이 있으며, 이러한 약물은 안전성이 높고 사용법이 간단하여 자가 치료에 적합합니다. 많은 사람들이 일상적으로 사용하며, 특정 질병의 예방이나 치료에 효과적입니다. 그러나 일반의약품을 사용할 때에도 주의사항을 잘 읽고 따라야 하며, 증상이 지속되거나 악화될 경우에는 전문가의 상담을 받는 것이 중요합니다.
            <br />
            <br />
            이러한 다양한 의약품들은 우리의 건강을 지키고, 질병을 예방하는 데 중요한 역할을 하고 있습니다. 의약품의 올바른 사용은 건강한 삶을 유지하는 데 필수적이며, 각 개인의 건강 상태와 필요에 맞는 적절한 선택이 필요합니다. 따라서 의약품에 대한 이해를 높이고, 필요할 때 적절한 조치를 취하는 것이 중요합니다.
            </p>

            
            <section className={styles.image_section}>
               <div className={styles.image_container}>
                  <img src="/images/sub102/102_1.jpg" alt="일반의약품_대표이미지" />
                  <div className={styles.overlay_title}>일반의약품</div>
                  <div className={styles.overlay_hover}>
                     일반의약품은 약국에서 처방 없이 구매할 수 있는 의약품으로, 경미한 증상이나 일상적인 건강 문제를 해결하는 데 사용됩니다. 진통제, 감기약, 소화제 등이 있으며, 안전성이 높고 사용법이 간단하여 자가 치료에 적합합니다. 사용 시 주의사항을 잘 읽고 따라야 하며, 많은 사람들이 일상적으로 사용합니다.
                  </div>
               </div>
               <div className={styles.image_container}>
                  <img src="/images/sub102/102_2.jpg" alt="전문의약품_대표이미지" />
                  <div className={styles.overlay_title}>전문의약품</div>
                  <div className={styles.overlay_hover}>
                     전문의약품은 의사의 처방이 필요한 약물로, 중증 질환이나 만성 질환의 치료에 사용됩니다. 항생제, 항암제, 심혈관계 약물 등이 있으며, 부작용이나 상호작용이 있을 수 있어 반드시 의사의 지시에 따라야 합니다. 이러한 약물은 환자의 건강 회복과 질병 치료에 중요한 역할을 합니다.
                  </div>
               </div>
               <div className={styles.image_container}>
                  <img src="/images/sub102/102_3.jpg" alt="건강기능식품_대표이미지" />
                  <div className={styles.overlay_title}>건강기능식품</div>
                  <div className={styles.overlay_hover}>
                     건강기능식품은 특정한 건강 효과를 목적으로 하는 제품으로, 비타민, 미네랄, 허브 추출물 등이 포함됩니다. 오메가-3, 프로바이오틱스, 홍삼 등이 있으며, 건강 유지와 증진에 도움을 줄 수 있습니다. 의약품과는 달리 질병을 치료하지 않고 건강을 보조하며, 과다 섭취 시 부작용이 발생할 수 있습니다. 균형 잡힌 식사와 함께 섭취할 때 효과가 극대화됩니다.
                  </div>
               </div>
            </section>
         </div>

      </>
   );
}

export default Sub102;
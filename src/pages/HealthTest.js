import React from "react";
import { useSelector } from "react-redux";
import { healthTestList } from "../utils/dataRender";
import "../styles/HealthTest.scss";

const HealthTest = () => {
  const { language } = useSelector((store) => store.app);

  return (
    <div className="health-test">
      <img
        src="https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F04%2F18%2F164430-coverpage--6.png&w=1920&q=75"
        alt={language === "vi" ? "Bài test sức khỏe" : "Health Test"}
        className="health-test__image"
      />

      <div className="health-test-content u-wrapper">
        <div className="health-test-content__title">
          <h2>{language === "vi" ? `Các bài test` : `Tests`}</h2>
        </div>

        <div className="health-test-list">
          {healthTestList.length > 0 &&
            healthTestList.map((test) => {
              return (
                <div key={test.id} className="health-test-item">
                  <img
                    src={test.imageItem}
                    alt={language === "vi" ? test.nameVi : test.nameEn}
                    className="health-test-item__image"
                  />

                  <div className="health-test-item__name">
                    <span>{language === "vi" ? test.nameVi : test.nameEn}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HealthTest;

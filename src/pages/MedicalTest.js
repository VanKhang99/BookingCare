import React from "react";
import { useSelector } from "react-redux";
import "../styles/MedicalTest.scss";

const MedicalTest = () => {
  const { language } = useSelector((store) => store.app);

  return (
    <div className="medical-test">
      <span>
        {language === "vi"
          ? "Xét nghiệm y học sẽ được ra mắt trong thời gian sắp tới"
          : "Medical tests will be released in the near future"}
      </span>
    </div>
  );
};

export default MedicalTest;

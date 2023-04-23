import React from "react";
import { useSelector } from "react-redux";
import "../styles/MedicalProduct.scss";

const MedicalProduct = () => {
  const { language } = useSelector((store) => store.app);

  return (
    <div className="medical-product">
      <span>
        {language === "vi"
          ? "Các sản phẩm y tế sẽ được thêm vào trang web trong thời gian sớm nhất. Vui lòng quay lại sau!"
          : "Medical products will be added to the site shortly. Please come back later!"}
      </span>
    </div>
  );
};

export default MedicalProduct;

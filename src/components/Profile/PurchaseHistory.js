import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const PurchaseHistory = () => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  return (
    <div className="purchase-history">
      <h2 className="profile-heading">{t("profile.purchase-history")}</h2>

      <p style={{ fontSize: "1.8rem", color: "#d01a1d", fontWeight: 600 }}>
        {language === "vi"
          ? "Tính năng này sẽ được cập nhật trong thời gian tới. Vui lòng quay lại sau!"
          : "This feature will be updated in the near future. Please come back later!"}
      </p>
    </div>
  );
};

export default PurchaseHistory;

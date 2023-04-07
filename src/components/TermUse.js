import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "../styles/TermUse.scss";

const TermUse = () => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  return (
    <div className="term-use">
      <p>{t("term-use.continue-use")}</p>
      {language === "vi" ? (
        <p>
          <a href="#">Điều khoản sử dụng</a> của chúng tôi
        </p>
      ) : (
        <p>
          our <a href="#">Term of use</a>
        </p>
      )}
    </div>
  );
};

export default TermUse;

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "../system/styles/System.scss";

const System = () => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  useEffect(() => {
    document.title = language === "vi" ? `Trung tâm quản lý` : `Management Center`;
  }, [language]);

  return (
    <>
      <div className="system-container">
        <div className="system-content">
          <div className="system-manage">{t("system-welcome")}</div>
        </div>
      </div>
    </>
  );
};

export default System;

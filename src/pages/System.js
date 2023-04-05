import { useTranslation } from "react-i18next";

import "../system/styles/System.scss";

const System = () => {
  const { t } = useTranslation();

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

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import "../system/styles/System.scss";

const System = () => {
  const { t } = useTranslation();
  const { pathSystem } = useSelector((store) => store.app);

  return (
    <>
      <div className="system-container">
        <div className="system-content">
          {pathSystem && pathSystem.endsWith("system") && (
            <div className="system-manage">{t("system-welcome")}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default System;

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import "../styles/RoleBookingCare.scss";

const RoleBookingCare = () => {
  const [showDetail, setShowDetail] = useState(true);
  const { t } = useTranslation();

  const handleShowDetail = () => {
    return setShowDetail(!showDetail);
  };

  return (
    <div className="role-booking u-wrapper">
      <div className="role-title">
        <h2>{t("role-bc.title")}</h2>
        <div className="role-title__icon" onClick={handleShowDetail}>
          {showDetail ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
        </div>
      </div>

      <div className={`${showDetail ? "role-content show" : "role-content"}`}>
        <div className="role-first">
          <h4>{t("role-bc.help-people")}</h4>
          <ul className="role-first-list">
            <li>{t("role-bc.help-people-1")}</li>
            <li>{t("role-bc.help-people-2")}</li>
            <li>{t("role-bc.help-people-3")}</li>
            <li>{t("role-bc.help-people-4")}</li>
            <li>{t("role-bc.help-people-5")}</li>
          </ul>
        </div>

        <div className="role-second">
          <h4>{t("role-bc.support")}</h4>
          <div className="role-sub-second">
            <span>{t("role-bc.before-exam")}</span>
            <ul>
              <li>{t("role-bc.before-exam-1")}</li>
              <li>{t("role-bc.before-exam-2")}</li>
            </ul>
          </div>
          <div className="role-sub-second">
            <span>{t("role-bc.during-exam")}</span>
            <ul>
              <li>{t("role-bc.during-exam-1")}</li>
              <li>{t("role-bc.during-exam-2")}</li>
            </ul>
          </div>
          <div className="role-sub-second">
            <span>{t("role-bc.after-exam")}</span>
            <ul>
              <li>{t("role-bc.after-exam-1")}</li>
              <li>{t("role-bc.after-exam-2")}</li>
              <li>{t("role-bc.after-exam-3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBookingCare;

import React from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import HtmlReactParser from "html-react-parser";
import "../styles/IntroSpecialty.scss";

const IntroSpecialty = ({ specialtyData, isOpenFullIntro, onShowMoreDataIntro, remote }) => {
  const { t } = useTranslation();
  return (
    <div className="intro-container">
      <div className="intro-overlay">
        <div className="intro-content u-wrapper">
          <div className={`intro-description ${isOpenFullIntro ? "show" : ""}`}>
            {!_.isEmpty(specialtyData) &&
              HtmlReactParser(remote ? specialtyData.descriptionRemoteHTML : specialtyData.descriptionHTML)}
          </div>
          <div className="intro-button">
            <button onClick={onShowMoreDataIntro}>
              {isOpenFullIntro ? t("button.hide-away") : t("button.see-more")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSpecialty;

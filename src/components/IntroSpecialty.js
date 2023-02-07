import React from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";
import "../styles/IntroSpecialty.scss";

const IntroSpecialty = ({ specialtyData, isOpenFullIntro, onShowMoreDataIntro, remote }) => {
  return (
    <div className="intro-container">
      <div className="intro-overlay">
        <div className="intro-content u-wrapper">
          <div className={`intro-description ${isOpenFullIntro ? "show" : ""}`}>
            {!_.isEmpty(specialtyData) &&
              specialtyData.descriptionHTML &&
              HtmlReactParser(remote ? specialtyData.descriptionRemoteHTML : specialtyData.descriptionHTML)}
          </div>
          <div className="intro-button">
            <button onClick={onShowMoreDataIntro}>{isOpenFullIntro ? "Ẩn bớt" : "Xem thêm"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSpecialty;

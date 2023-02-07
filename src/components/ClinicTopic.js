import React, { memo } from "react";
import HtmlReactParser from "html-react-parser";
import { Element } from "react-scroll";
import "../styles/ClinicTopic.scss";

const ClinicTopic = ({ html, title, clinicId }) => {
  return (
    <>
      <Element name={title}>
        <div className="clinic-topic">
          <h2 className="clinic-topic__title u-clinic-title">{title}</h2>
          <div className={`clinic-topic-content ${clinicId && clinicId === "CLI2" ? "img-full" : ""}`}>
            {HtmlReactParser(html)}
          </div>
        </div>
      </Element>
    </>
  );
};

export default memo(ClinicTopic);

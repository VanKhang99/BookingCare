import React, { memo } from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { path } from "../../utils/constants";
import "../../styles/Introduce.scss";

const Introduce = ({ doctorData, id, small, buttonSeeMore, packageData, packageClinicSpecialty, remote }) => {
  const { language } = useSelector((store) => store.app);
  const { t } = useTranslation();

  const handleDisplayNameRolePosition = (doctor) => {
    if (doctor.positionId === "P0") {
      return `${
        language === "vi"
          ? `${doctor.roleData.valueVi} - ${doctor.lastName} ${doctor.firstName} ${
              remote ? "(Bác sĩ từ xa)" : ""
            }`
          : `${doctor.roleData.valueEn} - ${doctor.firstName} ${doctor.lastName} ${
              remote ? "(Telemedicine)" : ""
            }`
      }`;
    } else if (doctor.roleId === "R8") {
      return `${
        language === "vi"
          ? `${doctor.positionData.valueVi} - ${doctor.lastName} ${doctor.firstName} ${
              remote ? "(Bác sĩ từ xa)" : ""
            }`
          : `${doctor.positionData.valueEn} - ${doctor.firstName} ${doctor.lastName} ${
              remote ? "(Telemedicine)" : ""
            }`
      }`;
    }

    return `${
      language === "vi"
        ? `${doctor.positionData.valueVi} - ${doctor.roleData.valueVi} - ${doctor.lastName} ${
            doctor.firstName
          } ${remote ? "(Bác sĩ từ xa)" : ""} `
        : `
    ${doctor.positionData.valueEn} - ${doctor.roleData.valueEn} - ${doctor.firstName} ${doctor.lastName} ${
            remote ? "(Telemedicine)" : ""
          }
    `
    }`;
  };

  if (!_.isEmpty(packageData)) {
    return (
      <>
        <div className={small ? "introduction introduction--small" : "introduction u-wrapper"}>
          <div className="introduction-left">
            <div
              className="introduction-left__image introduction-left__image--package"
              style={{
                backgroundImage: `url(${packageData.imageUrl})`,
              }}
            ></div>
            {buttonSeeMore && (
              <>
                {packageClinicSpecialty ? (
                  <Link
                    to={`/${path.CLINIC}/${packageData.clinicId}/specialties/${packageData.specialtyId}/package/${packageData.id}`}
                    className="info-left__button"
                  >
                    {t("button.see-more")}
                  </Link>
                ) : (
                  <Link to={`/package-clinic/${id}`} className="info-left__button">
                    {t("button.see-more")}
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="introduction-right">
            <h2 className="introduction-right__name">
              {language === "vi" ? packageData.nameVi : packageData.nameEn}
            </h2>
            <div className="introduction-right__summary">{HtmlReactParser(packageData.introductionHTML)}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={small ? "introduction introduction--small" : "introduction u-wrapper"}>
        <div className="introduction-left">
          <div
            className="introduction-left__image"
            style={{
              backgroundImage: `url(${doctorData?.imageUrl ? doctorData?.imageUrl : ""})`,
            }}
          ></div>
          {buttonSeeMore && (
            <>
              {remote ? (
                <Link to={`/doctor/remote/${id}`} className="info-left__button">
                  {t("button.see-more")}
                </Link>
              ) : (
                <Link to={`/doctor/${id}`} className="info-left__button">
                  {t("button.see-more")}
                </Link>
              )}
            </>
          )}
        </div>
        <div className="introduction-right">
          <h2 className="introduction-right__name">
            {doctorData?.positionData && doctorData?.roleData && handleDisplayNameRolePosition(doctorData)}
          </h2>
          <div className="introduction-right__summary">
            {doctorData?.moreData?.introductionHTML && HtmlReactParser(doctorData.moreData.introductionHTML)}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Introduce);

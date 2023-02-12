import React, { memo } from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useFetchDataBaseId } from "../../utils/CustomHook";
import { getDetailDoctor } from "../../slices/doctorSlice";
import "../../styles/Introduce.scss";

const Introduce = ({ id, small, buttonSeeMore, packageData, packageClinicSpecialty, remote }) => {
  const { language } = useSelector((store) => store.app);
  const { t } = useTranslation();
  const doctor = useFetchDataBaseId(id, "doctor", getDetailDoctor);

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
                backgroundImage: `url(${packageData.clinicData?.logo ? packageData.clinicData?.logo : ""})`,
              }}
            ></div>
            {buttonSeeMore && (
              <>
                {packageClinicSpecialty ? (
                  <Link to={`/package-specialty/${id}`} className="info-left__button">
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
            <div className="introduction-right__summary">
              {packageData?.introductionHTML && HtmlReactParser(packageData?.introductionHTML)}
            </div>
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
              backgroundImage: `url(${doctor?.image ? doctor?.image : ""})`,
            }}
          ></div>
          {buttonSeeMore && (
            <>
              {remote ? (
                <Link to={`/remote/doctor/${id}`} className="info-left__button">
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
            {doctor?.positionData && doctor?.roleData && handleDisplayNameRolePosition(doctor)}
          </h2>
          <div className="introduction-right__summary">
            {doctor?.anotherInfo?.introductionHTML && HtmlReactParser(doctor.anotherInfo.introductionHTML)}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Introduce);

import React, { memo } from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useFetchDataBaseId } from "../../utils/CustomHook";
import { getDetailDoctor } from "../../slices/doctorSlice";
import "../../styles/Introduce.scss";

const Introduce = ({ id, small, buttonSeeMore, packageData, packageClinicSpecialty, remote }) => {
  const { language } = useSelector((store) => store.app);
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
        <div className={`introduction ${small ? "small" : "u-wrapper"}`}>
          <div className="info-left">
            <div
              className="info-left__image info-left__image--package"
              style={{
                backgroundImage: `url(${packageData.clinicData?.logo ? packageData.clinicData?.logo : ""})`,
              }}
            ></div>
            {buttonSeeMore && (
              <>
                {packageClinicSpecialty ? (
                  <Link to={`/package-specialty/${id}`} className="info-left__button">
                    Xem thêm
                  </Link>
                ) : (
                  <Link to={`/package-clinic/${id}`} className="info-left__button">
                    Xem thêm
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="info-right">
            <h2 className="info-right__name">
              {language === "vi" ? packageData.nameVi : packageData.nameEn}
            </h2>
            <div className="info-right__summary">
              {packageData?.introductionHTML && HtmlReactParser(packageData?.introductionHTML)}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`introduction ${small ? "small" : "u-wrapper"}`}>
        <div className="info-left">
          <div
            className="info-left__image"
            style={{
              backgroundImage: `url(${doctor?.image ? doctor?.image : ""})`,
            }}
          ></div>
          {buttonSeeMore && (
            <>
              {remote ? (
                <Link to={`/remote/doctor/${id}`} className="info-left__button">
                  Xem thêm
                </Link>
              ) : (
                <Link to={`/doctor/${id}`} className="info-left__button">
                  Xem thêm
                </Link>
              )}
            </>
          )}
        </div>
        <div className="info-right">
          <h2 className="info-right__name">
            {doctor?.positionData && doctor?.roleData && handleDisplayNameRolePosition(doctor)}
          </h2>
          <div className="info-right__summary">
            {doctor?.anotherInfo?.introductionHTML && HtmlReactParser(doctor.anotherInfo.introductionHTML)}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Introduce);

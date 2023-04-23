import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../utils/constants";
import "../styles/SpecialtiesItem.scss";

const SpecialtiesItem = ({ remote, specialty }) => {
  const { language } = useSelector((store) => store.app);
  return (
    <Link
      to={
        remote
          ? `/${path.SPECIALTIES}/${path.REMOTE}/${specialty.id}`
          : `/${path.SPECIALTIES}/${specialty.id}`
      }
      className="specialties-item"
    >
      <div className="specialties-item__image">
        <img
          src={remote ? specialty.imageRemoteUrl : specialty.imageUrl}
          alt={language === "vi" ? specialty.nameVi : specialty.nameEn}
        />
      </div>

      <div className="specialties-item__name">
        {remote ? (
          <span>{language === "vi" ? `${specialty.nameVi} từ xa` : `Remote ${specialty.nameEn}`}</span>
        ) : (
          <span>{language === "vi" ? specialty.nameVi : specialty.nameEn}</span>
        )}
      </div>
    </Link>
  );
};

export default SpecialtiesItem;

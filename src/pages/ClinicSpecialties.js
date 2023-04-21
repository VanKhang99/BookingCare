import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { InputSearch } from "../components";
import { getAllSpecialtiesByClinicId, specialtiesClinicSearched } from "../slices/clinicSpecialtySlice";
import { helperFilterSearch } from "../utils/helpers";
import { MdLocationOn } from "react-icons/md";
import { path } from "../utils/constants";
import "../styles/ClinicSpecialties.scss";

const ClinicSpecialties = () => {
  const dispatch = useDispatch();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);
  const { specialtiesForClinic, filterSpecialtiesForClinic } = useSelector((store) => store.clinicSpecialty);

  const handleSearchSpecialties = (e) => {
    let specialtiesCopy = [...specialtiesForClinic];
    const newSpecialties = specialtiesCopy.filter((specialty) => {
      const { targetName, input } = helperFilterSearch(e.target.value, specialty.specialtyName.nameVi);

      if (language === "vi") return targetName.includes(input);

      return specialty.nameData.valueEn.toLowerCase().includes(e.target.value.toLowerCase());
    });

    dispatch(specialtiesClinicSearched(newSpecialties));
  };

  useEffect(() => {
    if (specialtiesForClinic.length) return;

    const dispatchedThunk = dispatch(getAllSpecialtiesByClinicId(clinicId));

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialtiesForClinic.length]);

  useEffect(() => {
    if (specialtiesForClinic.length > 0) {
      document.title =
        language === "vi"
          ? `Các chuyên khoa tại ${specialtiesForClinic[0].clinicInfo.nameVi}`
          : `Specialties at ${specialtiesForClinic[0].clinicInfo.nameEn}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, specialtiesForClinic.length]);

  return (
    <div className="clinic-specialties-container">
      <div className="clinic-specialties u-wrapper">
        <div className="clinic-specialties-top">
          <h2 className="clinic-specialties-top__title">
            {language === "vi" ? "Danh sách các chuyên khoa" : "List of specialties"}
          </h2>

          <div className="clinic-specialties-top-search">
            <InputSearch
              placeholder={language === "vi" ? "Tìm kiếm chuyên khoa" : "Search for a specialty"}
              onSearch={handleSearchSpecialties}
            />
          </div>
        </div>

        <div className="clinic-specialties-list">
          {filterSpecialtiesForClinic.length > 0 &&
            filterSpecialtiesForClinic.map((specialty) => {
              const {
                imageUrl,
                specialtyName,
                clinicInfo: { imageUrl: imageClinic, nameVi, nameEn },
              } = specialty;

              return (
                <Link
                  to={`/${path.CLINIC}/${specialty.clinicId}/${path.SPECIALTIES}/${specialty.specialtyId}`}
                  key={specialty.specialtyId}
                  className="clinic-specialties-item"
                >
                  <div className="clinic-specialties-item__image">
                    <img
                      src={imageUrl ? imageUrl : imageClinic}
                      alt={`Khám ${specialtyName.nameVi} - ${nameVi}`}
                    />
                  </div>

                  <div className="clinic-specialties-info">
                    <span className="clinic-specialties-info__name">
                      {language === "vi"
                        ? `Khám ${specialtyName.nameVi} - ${nameVi}`
                        : `${specialtyName.nameEn} examination - ${nameEn}`}
                    </span>

                    <div className="clinic-specialties-info__address">
                      <MdLocationOn />
                      <span>{specialty.address}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ClinicSpecialties;

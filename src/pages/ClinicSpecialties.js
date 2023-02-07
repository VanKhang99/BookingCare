import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Header, Footer } from "../components";
import { getAllSpecialtiesByClinicId } from "../slices/clinicSpecialtySlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import "../styles/ClinicSpecialties.scss";

const ClinicSpecialties = () => {
  const { t } = useTranslation();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);
  const specialties = useFetchDataBaseId(clinicId, "specialties", getAllSpecialtiesByClinicId);

  return (
    <div className="clinic-specialties-container">
      <Header />

      <div className="clinic-specialties u-wrapper">
        <h4 className="clinic-specialties__title">{t("clinic-specialties.title")}</h4>

        <div className="specialties">
          {specialties.length > 0 &&
            specialties.map((specialty, index) => {
              return (
                <Link
                  to={`/clinics/${specialty.clinicId}/specialties/${specialty.specialtyId}`}
                  className="specialty"
                  key={index}
                >
                  {language === "vi" ? specialty.nameSpecialty.valueVi : specialty.nameSpecialty.valueEn}
                </Link>
              );
            })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClinicSpecialties;

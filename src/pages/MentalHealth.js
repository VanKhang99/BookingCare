import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loading, SpecialtiesItem } from "../components";
import { getAllSpecialtiesMentalHealth } from "../slices/specialtySlice";
import "../styles/MentalHealth.scss";

const MentalHealth = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { isLoadingSpecialties, specialtiesMentalHealth } = useSelector((store) => store.specialty);

  useEffect(() => {
    if (specialtiesMentalHealth.length) return;

    const dispatchedThunk = dispatch(getAllSpecialtiesMentalHealth());

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllSpecialtiesMentalHealth.length]);

  useEffect(() => {
    document.title = language === "vi" ? `Sức khỏe tinh thần` : `Mental health`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="mental-health u-wrapper">
      {!isLoadingSpecialties ? (
        <>
          <div className="mental-health-top">
            <h2>{language === "vi" ? `Sức khỏe tinh thần` : `Mental health`}</h2>
          </div>

          <div className="mental-health-list ">
            {specialtiesMentalHealth.length > 0 &&
              specialtiesMentalHealth.map((specialty) => {
                return <SpecialtiesItem remote={0} specialty={specialty} />;
              })}

            {specialtiesMentalHealth.length > 0 &&
              specialtiesMentalHealth.map((specialty) => {
                return <SpecialtiesItem remote={1} specialty={specialty} />;
              })}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MentalHealth;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InputSearch, Loading } from "../components";
import { getAllDoctors, doctorSearched } from "../slices/doctorSlice";
import { helperFilterSearch, helperDisplayNameDoctor } from "../utils/helpers";
import "../styles/Doctors.scss";

const Doctors = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { isLoadingDoctors, doctors, filterDoctors } = useSelector((store) => store.doctor);

  const handleSearchDoctors = (e) => {
    let doctorsCopy = [...doctors];
    const newDoctors = doctorsCopy.filter((doctor) => {
      const targetCompare = helperDisplayNameDoctor(doctor);
      const { targetName, input } = helperFilterSearch(e.target.value, targetCompare);

      return targetName.includes(input);
    });

    dispatch(doctorSearched(newDoctors));
  };

  useEffect(() => {
    if (doctors.length) return;

    const dispatchedThunk = dispatch(getAllDoctors("popular"));

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors.length]);

  useEffect(() => {
    document.title =
      language === "vi" ? "Các bác sĩ nổi bật tuần vừa qua" : "The outstanding doctors of the past week";
  }, [language]);

  return (
    <div className="doctors-popular-container">
      {!isLoadingDoctors ? (
        <div className="doctors-popular u-wrapper">
          <div className="doctors-popular-top">
            <h2 className="doctors-popular-top__title">
              {language === "vi" ? "Danh sách bác sĩ nổi bật" : "List of doctors"}
            </h2>

            <div className="doctors-popular-top-search">
              <InputSearch
                placeholder={language === "vi" ? "Tìm kiếm bác sĩ" : "Search for a doctor"}
                onSearch={handleSearchDoctors}
              />
            </div>
          </div>

          <div className="doctors-popular-list">
            {filterDoctors.length > 0 &&
              filterDoctors.map((doctor) => {
                const {
                  doctorId,
                  specialtyData,
                  moreData: { firstName, lastName, imageUrl },
                } = doctor;
                return (
                  <Link to={`/doctor/${doctorId}`} key={doctorId} className="doctors-popular-item">
                    <div className="doctors-popular-item__image">
                      <img
                        src={imageUrl}
                        alt={language === "vi" ? `${firstName} ${lastName}` : `${lastName} ${firstName}`}
                      />
                    </div>

                    <div className="doctors-popular-info">
                      <span className="doctors-popular-info__name">
                        {helperDisplayNameDoctor(doctor, language)}
                      </span>

                      <div className="doctors-popular-info__specialty">
                        <span>{language === "vi" ? specialtyData.nameVi : specialtyData.nameEn}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Doctors;

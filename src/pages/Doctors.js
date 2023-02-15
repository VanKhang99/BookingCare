import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Header, InputSearch, Footer } from "../components";
import { getOutstandingDoctors } from "../slices/doctorSlice";
import { helperFilterSearch } from "../utils/helpers";
import "../styles/Doctors.scss";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filterDoctors, setFilterDoctors] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleFetchSpecialties = async () => {
    try {
      const res = await dispatch(getOutstandingDoctors());
      console.log(res);
      if (res?.payload?.data?.doctors.length > 0) {
        setDoctors([...res.payload.data.doctors]);
        setFilterDoctors([...res.payload.data.doctors]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchDoctors = (e) => {
    let doctorsCopy = [...doctors];
    const newDoctors = doctorsCopy.filter((doctor) => {
      const targetCompare = handleDisplayNameDoctor(doctor);
      const { targetCompareLowerCase, inputPassedLowerCase } = helperFilterSearch(
        e.target.value,
        targetCompare
      );

      return targetCompareLowerCase.includes(inputPassedLowerCase);
    });

    return setFilterDoctors(newDoctors);
  };

  const handleDisplayNameDoctor = (data) => {
    let finalName;
    const {
      anotherInfo: { positionData, roleData, firstName, lastName, positionId, roleId },
    } = data;

    if (language === "vi") {
      finalName = `${positionId !== "P0" ? `${positionData.valueVi} - ` : ""}${
        roleId !== "R8" ? `${roleData.valueVi} - ` : ""
      }${lastName} ${firstName}`;
    } else {
      finalName = `${positionId !== "P0" ? `${positionData.valueEn} - ` : ""}${
        roleId !== "R8" ? `${roleData.valueEn} - ` : ""
      }${lastName} ${firstName}`;
    }

    return finalName;
  };

  useEffect(() => {
    handleFetchSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="doctors-popular-container">
      <Header />

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
              const { anotherInfo } = doctor;
              return (
                <Link to={`/doctor/${doctor.id}`} key={doctor.id} className="doctors-popular-item">
                  <div className="doctors-popular-item__image">
                    <img
                      src={anotherInfo.image}
                      alt={
                        language === "vi"
                          ? `${anotherInfo.firstName} ${anotherInfo.lastName}`
                          : `${anotherInfo.lastName} ${anotherInfo.firstName}`
                      }
                    />
                  </div>

                  <div className="doctors-popular-info">
                    <span className="doctors-popular-info__name">{handleDisplayNameDoctor(doctor)}</span>

                    <div className="doctors-popular-info__specialty">
                      <span>
                        {language === "vi" ? doctor.specialtyData.valueVi : doctor.specialtyData.valueEn}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Doctors;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Header, InputSearch, Footer } from "../components";
import { getAllSpecialties } from "../slices/specialtySlice";
import { path } from "../utils/constants";
import { helperFilterSearch } from "../utils/helpers";
import "../styles/Specialties.scss";

const Specialties = ({ remote }) => {
  const [specialties, setSpecialties] = useState([]);
  const [filterSpecialties, setFilterSpecialties] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleFetchSpecialties = async () => {
    try {
      const res = remote
        ? await dispatch(getAllSpecialties("remote"))
        : await dispatch(getAllSpecialties("popular"));
      if (res?.payload?.specialties.length > 0) {
        setSpecialties([...res.payload.specialties]);
        setFilterSpecialties([...res.payload.specialties]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSpecialties = (e) => {
    let specialtiesCopy = [...specialties];
    const newSpecialties = specialtiesCopy.filter((specialty) => {
      const { targetCompareLowerCase, inputPassedLowerCase } = helperFilterSearch(
        e.target.value,
        specialty.nameData.valueVi
      );

      if (language === "vi") return targetCompareLowerCase.includes(inputPassedLowerCase);

      return specialty.nameData.valueEn.toLowerCase().includes(e.target.value.toLowerCase());
    });

    return setFilterSpecialties(newSpecialties);
  };

  useEffect(() => {
    handleFetchSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="specialties">
      <Header />

      <div className="specialties-list u-wrapper">
        <div className="specialties-top">
          <h2>
            {language === "vi"
              ? `Các chuyên khoa ${remote ? "từ xa" : "phổ biến"}`
              : `${remote ? "Telemedicine" : "Popular"} specialties `}
          </h2>
          <div className="specialties-top-search">
            <InputSearch
              placeholder={language === "vi" ? "Tìm kiếm chuyên khoa" : "Search for a specialty"}
              onSearch={handleSearchSpecialties}
            />
          </div>
        </div>
        {filterSpecialties.length > 0 &&
          filterSpecialties.map((specialty) => {
            return (
              <Link
                to={
                  remote
                    ? `/${path.SPECIALTY}/${path.REMOTE}/${specialty.specialtyId}`
                    : `/${path.SPECIALTY}/${specialty.specialtyId}`
                }
                key={specialty.specialtyId}
                className="specialties-item"
              >
                <div className="specialties-item__image">
                  <img
                    src={remote ? specialty.imageRemote : specialty.image}
                    alt={language === "vi" ? specialty.nameData.valueVi : specialty.nameData.valueEn}
                  />
                </div>

                <div className="specialties-item__name">
                  {remote ? (
                    <span>
                      {language === "vi"
                        ? `${specialty.nameData.valueVi} từ xa`
                        : `Remote ${specialty.nameData.valueEn}`}
                    </span>
                  ) : (
                    <span>{language === "vi" ? specialty.nameData.valueVi : specialty.nameData.valueEn}</span>
                  )}
                </div>
              </Link>
            );
          })}
      </div>

      <Footer />
    </div>
  );
};

export default Specialties;

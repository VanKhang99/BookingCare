import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InputSearch } from "../components";
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
      const { targetName, input } = helperFilterSearch(e.target.value, specialty.nameVi);

      if (language === "vi") return targetName.includes(input);

      return specialty.nameData.valueEn.toLowerCase().includes(e.target.value.toLowerCase());
    });

    return setFilterSpecialties(newSpecialties);
  };

  useEffect(() => {
    handleFetchSpecialties();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title =
      language === "vi"
        ? `Các chuyên khoa phổ biến ${remote ? "từ xa" : ""}`
        : `Popular ${remote ? "remote" : ""} specialties`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="specialties u-wrapper">
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
      <div className="specialties-list ">
        {filterSpecialties.length > 0 &&
          filterSpecialties.map((specialty) => {
            return (
              <Link
                to={
                  remote
                    ? `/${path.SPECIALTIES}/${path.REMOTE}/${specialty.id}`
                    : `/${path.SPECIALTIES}/${specialty.id}`
                }
                key={specialty.id}
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
                    <span>
                      {language === "vi" ? `${specialty.nameVi} từ xa` : `Remote ${specialty.nameEn}`}
                    </span>
                  ) : (
                    <span>{language === "vi" ? specialty.nameVi : specialty.nameEn}</span>
                  )}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Specialties;

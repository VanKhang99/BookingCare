import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useInView, InView } from "react-intersection-observer";
import { Header, InputSearch, Footer } from "../components";
import { GoSearch } from "react-icons/go";
import { RiArrowDownSLine } from "react-icons/ri";
import { getAllClinics } from "../slices/clinicSlice";
import { path } from "../utils/constants";
import "../styles/Clinics.scss";

const initialState = {
  clinicsSorted: [],
};

const Clinics = () => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { ref, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "-120px",
  });
  const alphabetItem = useMemo(() => {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
      <li key={letter} className="clinics-alphabet__letter">
        {letter}
      </li>
    ));
  }, []);

  const handleFetchClinics = async () => {
    try {
      const res = await dispatch(getAllClinics("both"));
      if (res.payload.clinics.length > 0) {
        // Create object alphabet {A: [], B: [], ...}
        const alphabetObject = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, word) => {
          acc[word] = [];
          return acc;
        }, {});

        // Push clinic have name start corresponding
        res.payload.clinics.forEach((clinic) => {
          alphabetObject[clinic.keyWord[0]].push(clinic);
        });

        // Filter object have array > 0
        const clinicsAlphabetOrder = Object.entries(alphabetObject).filter(([key, arr], index) => arr.length);
        return setState({ ...state, clinicsSorted: clinicsAlphabetOrder });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchClinics();
  }, []);

  return (
    <div className="clinics">
      <Header />

      <div className="clinics-content u-wrapper">
        <InView>
          <div className="clinics-top" ref={ref}>
            <h2>{language === "vi" ? "Cơ sở y tế" : "Health facilities"}</h2>

            <div className="clinics-actions">
              <div className="clinics-actions-filter">
                <select id="test" className="clinics-actions-filter__list">
                  <option value={language === "vi" ? "Tỉnh thành" : "Province"}>
                    {language === "vi" ? "Tỉnh thành" : "Province"}
                  </option>
                  <option value={language === "vi" ? "Thành phố Hồ Chí Minh" : "Ho Chi Minh City"}>
                    {language === "vi" ? "Thành phố Hồ Chí Minh" : "Ho Chi Minh City"}
                  </option>
                  <option value={language === "vi" ? "Thành phố Hà Nội" : "Ha Noi City"}>
                    {language === "vi" ? "Thành phố Hà Nội" : "Ha Noi City"}
                  </option>
                </select>
              </div>

              <div className="clinics-actions-search">
                <InputSearch
                  placeholder={language === "vi" ? "Tìm kiếm cơ sở y tế" : "Search for medical facilities"}
                  icon={<GoSearch />}
                  // onSearch={handleSearchSpecialties}
                />
              </div>
            </div>
          </div>
        </InView>

        <ul className={`clinics-alphabet ${inView ? "" : "fixed u-wrapper"}`}>
          <>{alphabetItem}</>
        </ul>

        <div className="clinics-list">
          {state.clinicsSorted.map((clinic, index) => {
            return (
              <React.Fragment key={index}>
                <div className="clinics-letter">
                  <div className="clinics-letter__header">
                    <span>{clinic[0]}</span>
                  </div>

                  <div className="clinics-letter-list">
                    {clinic[1].map((cl) => {
                      return (
                        <React.Fragment key={cl.clinicId}>
                          <Link to={`/${path.CLINIC}/${cl.clinicId}`} className="clinics-letter-item">
                            <div className="clinics-letter-item__image">
                              <img
                                src={cl.logo}
                                alt={
                                  language === "vi" ? cl.nameClinicData.valueVi : cl.nameClinicData.valueEn
                                }
                              />
                            </div>
                            <div className="clinics-letter-item__name">
                              {language === "vi" ? cl.nameClinicData.valueVi : cl.nameClinicData.valueEn}
                            </div>
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Clinics;

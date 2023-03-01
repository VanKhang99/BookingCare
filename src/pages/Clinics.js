import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useInView, InView } from "react-intersection-observer";
import { Element, Link as LinkScroll } from "react-scroll";
import { Header, InputSearch, Footer } from "../components";
import { GoSearch } from "react-icons/go";
import { getAllClinics } from "../slices/clinicSlice";
import { helperFilterSearch } from "../utils/helpers";
import { path } from "../utils/constants";
import "../styles/Clinics.scss";

const initialState = {
  alphabetNavigator: [],
  clinicsForActions: [],
  clinicsFiltered: [],
  inputSearch: "",
  alphabetIsActivated: "",
};

const Clinics = () => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { ref, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  });

  const handleFetchClinics = async () => {
    try {
      const res = await dispatch(getAllClinics("all"));
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
        const alphabetNavigator = clinicsAlphabetOrder.map((clinic) => clinic[0]);
        return setState({
          ...state,
          alphabetNavigator,
          clinicsForActions: clinicsAlphabetOrder,
          clinicsFiltered: clinicsAlphabetOrder,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectProvince = (e) => {
    let clinicsCopy = [...state.clinicsForActions];
    if (e.target.value === "Tỉnh thành") return setState({ ...state, clinicsFiltered: clinicsCopy });

    handleSearchClinics(e.target.value, "select");
  };

  const handleOnChangeSearch = (e) => {
    return setState({ ...state, inputSearch: e.target.value });
  };

  const handleSearchClinics = (inputToActions, type) => {
    let clinicsCopy = [...state.clinicsForActions];
    let newClinics = clinicsCopy.map(([key, clinic]) => {
      const clinicFiltered = clinic.filter((cl) => {
        const { targetCompareLowerCase, inputPassedLowerCase } = helperFilterSearch(
          inputToActions,
          type === "select" ? cl.address : cl.nameClinicData[language === "vi" ? "valueVi" : "valueEn"]
        );

        return targetCompareLowerCase.includes(inputPassedLowerCase);
      });

      return [key, clinicFiltered];
    });

    newClinics = newClinics.filter((cl) => cl[1].length);

    return setState({ ...state, clinicsFiltered: newClinics });
  };

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    handleSearchClinics(state.inputSearch, "search");
  };

  const handleActiveAlphabet = (letter) => {
    return setState({ ...state, alphabetIsActivated: letter });
  };

  const handleInActiveAlphabet = (letter) => {
    if (letter === "A") return setState({ ...state, alphabetIsActivated: "" });
  };

  useEffect(() => {
    handleFetchClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clinics">
      <Header />

      <div className="clinics-content">
        <InView>
          <div className="clinics-top u-wrapper" ref={ref}>
            <h2>{language === "vi" ? "Cơ sở y tế" : "Health facilities"}</h2>

            <div className="clinics-actions">
              <div className="clinics-actions-filter">
                <select id="test" className="clinics-actions-filter__list" onChange={handleSelectProvince}>
                  <option value="Tỉnh thành">{language === "vi" ? "Tỉnh thành" : "Province"}</option>
                  <option value="Thành phố Hồ Chí Minh">
                    {language === "vi" ? "Thành phố Hồ Chí Minh" : "Ho Chi Minh City"}
                  </option>
                  <option value="Thành phố Hà Nội">
                    {language === "vi" ? "Thành phố Hà Nội" : "Ha Noi City"}
                  </option>
                </select>
              </div>

              <div className="clinics-actions-search">
                <InputSearch
                  placeholder={language === "vi" ? "Tìm kiếm cơ sở y tế" : "Search for medical facilities"}
                  icon={<GoSearch />}
                  onSearch={handleOnChangeSearch}
                  onClickSearch={() => handleSearchClinics(state.inputSearch, "search")}
                  onEnterKey={handlePressEnter}
                />
              </div>
            </div>
          </div>
        </InView>

        <div className={`clinics-alphabet-container ${inView ? "" : "fixed"}`}>
          <ul className="clinics-alphabet u-wrapper">
            <>
              {state.alphabetNavigator.length > 0 &&
                state.alphabetNavigator.map((letter) => {
                  let offset;
                  offset = window.scrollY > 100 ? -75 : -165;
                  if (letter === "Y") {
                    offset = -270;
                  }

                  return (
                    <li key={letter} className="clinics-alphabet__letter">
                      <LinkScroll
                        className={`clinics-alphabet__letter-scroll ${
                          state.alphabetIsActivated === letter
                            ? "clinics-alphabet__letter-scroll--active"
                            : ""
                        }`}
                        to={letter}
                        spy={true}
                        // smooth={true}
                        offset={offset}
                        onSetActive={handleActiveAlphabet}
                        onSetInactive={handleInActiveAlphabet}
                      >
                        {letter}
                      </LinkScroll>
                    </li>
                  );
                })}
            </>
          </ul>
        </div>

        <div className="clinics-list u-wrapper">
          {state.clinicsFiltered.map((clinic, index) => {
            return (
              <React.Fragment key={index}>
                <Element name={clinic[0]}>
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
                </Element>
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

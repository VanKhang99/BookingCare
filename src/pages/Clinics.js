import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useInView, InView } from "react-intersection-observer";
import { Element, Link as LinkScroll } from "react-scroll";
import { InputSearch, ScrollToTop } from "../components";
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
  const [clinicsState, setClinicsState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { ref, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  });
  const clinicsHavePackages = useLocation().state?.clinicsHavePackages;

  const doClinicArrToRender = (arr) => {
    // Create object alphabet {A: [], B: [], ...}
    const alphabetObject = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, word) => {
      acc[word] = [];
      return acc;
    }, {});

    // Push clinic have name start corresponding
    arr.forEach((clinic) => {
      alphabetObject[clinic.keyWord[0]].push(clinic);
    });

    // Filter object have array > 0
    const clinicsAlphabetOrder = Object.entries(alphabetObject).filter(([key, arr], index) => arr.length);
    const alphabetNavigator = clinicsAlphabetOrder.map((clinic) => clinic[0]);

    return { alphabetNavigator, clinicsAlphabetOrder };
  };

  const handleFetchClinics = async () => {
    if (clinicsHavePackages) {
      const { alphabetNavigator, clinicsAlphabetOrder } = doClinicArrToRender(clinicsHavePackages);
      return setClinicsState({
        ...clinicsState,
        alphabetNavigator,
        clinicsForActions: clinicsAlphabetOrder,
        clinicsFiltered: clinicsAlphabetOrder,
      });
    }

    try {
      const res = await dispatch(getAllClinics("all"));
      if (res.payload.clinics.length > 0) {
        const { alphabetNavigator, clinicsAlphabetOrder } = doClinicArrToRender(res.payload.clinics);

        return setClinicsState({
          ...clinicsState,
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
    let clinicsCopy = [...clinicsState.clinicsForActions];
    if (e.target.value === "Tỉnh thành")
      return setClinicsState({ ...clinicsState, clinicsFiltered: clinicsCopy });

    handleSearchClinics(e.target.value, "select");
  };

  const handleOnChangeSearch = (e) => {
    return setClinicsState({ ...clinicsState, inputSearch: e.target.value });
  };

  const handleSearchClinics = (inputToActions, type) => {
    let clinicsCopy = [...clinicsState.clinicsForActions];
    let newClinics = clinicsCopy.map(([key, clinic]) => {
      const clinicFiltered = clinic.filter((cl) => {
        const { targetName, input } = helperFilterSearch(
          inputToActions,
          type === "select" ? cl.address : cl[language === "vi" ? "nameVi" : "nameEn"]
        );

        return targetName.includes(input);
      });

      return [key, clinicFiltered];
    });

    newClinics = newClinics.filter((cl) => cl[1].length);

    return setClinicsState({ ...clinicsState, clinicsFiltered: newClinics });
  };

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    handleSearchClinics(clinicsState.inputSearch, "search");
  };

  const handleActiveAlphabet = (letter) => {
    return setClinicsState({ ...clinicsState, alphabetIsActivated: letter });
  };

  const handleInActiveAlphabet = (letter) => {
    if (letter === clinicsState.alphabetNavigator[0])
      return setClinicsState({ ...clinicsState, alphabetIsActivated: "" });
  };

  useEffect(() => {
    handleFetchClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicsHavePackages?.length]);

  useEffect(() => {
    document.title =
      language === "vi"
        ? `Danh sách các cơ sở y tế uy tín ${clinicsHavePackages?.length ? "cung cấp gói khám bệnh" : ""}`
        : `List of reputable medical facilities ${
            clinicsHavePackages?.length ? "that provide medical examination packages" : ""
          }`;
  }, [language, clinicsHavePackages?.length]);

  return (
    <div className="clinics">
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
                  onClickSearch={() => handleSearchClinics(clinicsState.inputSearch, "search")}
                  onEnterKey={handlePressEnter}
                />
              </div>
            </div>
          </div>
        </InView>

        <div className={`clinics-alphabet-container ${inView ? "" : "fixed"}`}>
          <ul className="clinics-alphabet u-wrapper">
            <>
              {clinicsState.alphabetNavigator.length > 0 &&
                clinicsState.alphabetNavigator.map((letter) => {
                  let offset;
                  offset = window.scrollY > 100 ? -75 : -165;
                  if (letter === "Y") {
                    offset = -270;
                  }

                  return (
                    <li key={letter} className="clinics-alphabet__letter">
                      <LinkScroll
                        className={`clinics-alphabet__letter-scroll ${
                          clinicsState.alphabetIsActivated === letter
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
          {clinicsState.clinicsFiltered.length > 0 &&
            clinicsState.clinicsFiltered.map((clinic, index) => {
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
                            <React.Fragment key={cl.id}>
                              <Link
                                to={clinicsHavePackages?.length > 0 ? `${cl.id}` : `/${path.CLINIC}/${cl.id}`}
                                className="clinics-letter-item"
                              >
                                <div className="clinics-letter-item__image">
                                  <img src={cl.logoUrl} alt={language === "vi" ? cl.nameVi : cl.nameEn} />
                                </div>
                                <div className="clinics-letter-item__name">
                                  {language === "vi" ? cl.nameVi : cl.nameEn}
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

      <ScrollToTop />
    </div>
  );
};

export default Clinics;

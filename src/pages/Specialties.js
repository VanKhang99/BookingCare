import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputSearch, Loading, SpecialtiesItem } from "../components";
import { getAllSpecialties, specialtiesSearched } from "../slices/specialtySlice";
import { helperFilterSearch } from "../utils/helpers";
import "../styles/Specialties.scss";

const Specialties = ({ remote }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const {
    isLoadingSpecialties,
    specialtiesPopular,
    specialtiesRemote,
    filterSpecialtiesPopular,
    filterSpecialtiesRemote,
  } = useSelector((store) => store.specialty);

  const handleSearchSpecialties = (e) => {
    let specialtiesCopy = remote ? [...specialtiesRemote] : [...specialtiesPopular];
    const newSpecialties = specialtiesCopy.filter((specialty) => {
      const { targetName, input } = helperFilterSearch(e.target.value, specialty.nameVi);

      if (language === "vi") return targetName.includes(input);

      return specialty.nameData.valueEn.toLowerCase().includes(e.target.value.toLowerCase());
    });

    dispatch(specialtiesSearched({ newSpecialties, remote }));
  };

  const handleSpecialtiesRender = () => {
    if (remote) {
      if (!filterSpecialtiesRemote.length) return [];
      return filterSpecialtiesRemote;
    }

    if (!filterSpecialtiesPopular.length) return [];
    return filterSpecialtiesPopular;
  };

  useEffect(() => {
    if (remote) {
      if (specialtiesRemote.length) return;
    }

    if (specialtiesPopular.length) return;

    const dispatchedThunk = dispatch(getAllSpecialties(remote ? "remote" : "popular"));

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialtiesPopular.length, specialtiesRemote.length, remote]);

  useEffect(() => {
    document.title =
      language === "vi"
        ? `Các chuyên khoa phổ biến ${remote ? "từ xa" : ""}`
        : `Popular ${remote ? "remote" : ""} specialties`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="specialties u-wrapper">
      {!isLoadingSpecialties ? (
        <>
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
            {handleSpecialtiesRender().map((specialty) => {
              return <SpecialtiesItem key={specialty.id} remote={remote} specialty={specialty} />;
            })}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Specialties;

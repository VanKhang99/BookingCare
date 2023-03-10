import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ClinicTop, InputSearch, Doctor, Package, ModalBooking } from "../components";
import { getClinic } from "../slices/clinicSlice";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getAllDoctorsById, getDoctor } from "../slices/doctorSlice";
import { getAllPackagesType } from "../slices/packageTypeSlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { dataModalBooking, formatterPrice, helperFilterSearch } from "../utils/helpers";
import { GoSearch } from "react-icons/go";
import { SlRefresh } from "react-icons/sl";
import { TbFilter } from "react-icons/tb";
import "../styles/ClinicCarouselMore.scss";

const initialState = {
  inputSearch: "",
  isOpenModalBooking: false,
  hourBooked: "",

  doctorId: "",
  doctorData: {},
  packageId: "",
  packageData: {},

  // packagesFiltered: [],
  optionsCategory: [],
  optionsPrice: [],

  categorySelected: [],
  isOpenCategory: false,
  isOpenPrice: false,
};

const ClinicCarouselMore = ({ pageClinicDoctors, packageClinicSpecialty }) => {
  const [state, setState] = useState(initialState);
  const [packagesFiltered, setPackagesFiltered] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);
  const { doctorsById } = useSelector((store) => store.doctor);
  const { packageArr } = useSelector((store) => store.package);
  const { packagesType } = useSelector((store) => store.packageType);
  const dataClinic = useFetchDataBaseId(clinicId ? +clinicId : "", "clinic", getClinic);

  const handleOnChangeSearch = (e) => {
    return setState({ ...state, inputSearch: e.target.value });
  };

  const handleSearchPackages = (inputSearch) => {
    const isOptionAllSelected =
      state.categorySelected.includes("All") ||
      state.categorySelected.includes("Tất cả") ||
      !state.categorySelected.length;

    console.log(state.categorySelected.length);

    let newPackagesFiltered = packageArr.filter((pk) => {
      const { targetName, input } = helperFilterSearch(inputSearch, pk.nameVi);
      return targetName.includes(input);
    });

    if (!isOptionAllSelected && state.categorySelected.length) {
      newPackagesFiltered = newPackagesFiltered.filter((pk) => {
        const typePk = pk.packageType[language === "vi" ? "nameVi" : "nameEn"];
        return state.categorySelected.includes(typePk);
      });

      setPackagesFiltered(newPackagesFiltered);
      return;
    }

    console.log(newPackagesFiltered);
    setPackagesFiltered(inputSearch ? newPackagesFiltered : packageArr);
  };

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    handleSearchPackages(state.inputSearch);
  };

  const handleModal = useCallback(async (hourClicked, doctorId = null, packageId = null) => {
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking
    try {
      const res = pageClinicDoctors
        ? await dispatch(getDoctor(+doctorId))
        : await dispatch(getPackage(+packageId));

      if (res?.payload?.data) {
        return setState({
          ...state,
          ...(pageClinicDoctors
            ? { doctorData: res.payload.data, doctorId }
            : { packageData: res.payload.data, packageId }),

          isOpenModalBooking: !state.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });
      }

      return setState({
        ...state,
        isOpenModalBooking: !state.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const optionsFilter = () => {
    //option category
    const categoriesFilter = packagesType.reduce(
      (acc, pkType) => {
        const categoryName = language === "vi" ? pkType.nameVi : pkType.nameEn;
        if (!acc.includes(categoryName)) {
          acc.push(categoryName);
        }
        return acc;
      },
      [language === "vi" ? "Tất cả" : "All"]
    );

    // option prices
    const rangePrice = ["1000000", "5000000", "10000000"].map((price) => formatterPrice(language, price));
    const rangePriceFilter =
      language === "vi"
        ? [
            `Dưới ${rangePrice[0]}`,
            `Từ ${rangePrice[0]} đến ${rangePrice[1]}`,
            `Từ ${rangePrice[1]} đến ${rangePrice[2]}`,
            `Trên ${rangePrice[2]}`,
          ]
        : [
            `Under ${rangePrice[0]}`,
            `From ${rangePrice[0]} to ${rangePrice[1]}`,
            `From ${rangePrice[1]} to ${rangePrice[2]}`,
            `Over ${rangePrice[2]}`,
          ];

    return { categoriesFilter, rangePriceFilter };
  };

  const handleOptions = () => {
    const { categoriesFilter, rangePriceFilter } = optionsFilter();

    setState({
      ...state,
      optionsCategory: categoriesFilter,
      optionsPrice: rangePriceFilter,
    });
    setPackagesFiltered(packagesFiltered.length > 0 ? packagesFiltered : packageArr);
    return;
  };

  const handleDisplayOptions = (e, optionsOf) => {
    // All elements is don't have parent element class "filter-item"
    //will not be show "filter-select". Element "filter-select" stopPropagation
    // to prevent condition e.target.closest(".filter-item") => not hide "filter-select"
    if (!e.target.closest(".filter-item")) {
      return setState({
        ...state,
        optionsCategory: state.optionsCategory,
        optionsPrice: state.optionsPrice,
        isOpenCategory: false,
        isOpenPrice: false,
      });
    }

    setState((prevState) => {
      const { isOpenCategory, isOpenPrice } = prevState;
      switch (optionsOf) {
        case "Category":
          return { ...prevState, isOpenCategory: !isOpenCategory, isOpenPrice: false };
        case "Price":
          return { ...prevState, isOpenPrice: !isOpenPrice, isOpenCategory: false };
        default:
          return prevState;
      }
    });
  };

  const handleSelectedCategory = (category) => {
    if (!category) {
      const { categoriesFilter, rangePriceFilter } = optionsFilter();
      const isOptionAllSelected =
        state.categorySelected.includes("All") || state.categorySelected.includes("Tất cả");

      const categorySelected = packageArr.reduce((acc, pk) => {
        const checkOldSelectedCategory = state.categorySelected.includes(
          pk.packageType[language === "vi" ? "nameEn" : "nameVi"]
        );

        if (checkOldSelectedCategory) {
          acc.push(pk.packageType[language === "vi" ? "nameVi" : "nameEn"]);
        }
        return acc;
      }, []);

      setState({
        ...state,
        categorySelected: isOptionAllSelected
          ? [language === "vi" ? "Tất cả" : "All"]
          : [...new Set(categorySelected)],
        optionsCategory: categoriesFilter,
        optionsPrice: rangePriceFilter,
      });
      return;
    }

    const { categorySelected } = state;
    const isCategorySelected = categorySelected.includes(category);

    if (isCategorySelected) {
      const resetCategorySelected = state.categorySelected.filter((cate) => cate !== category);
      setState({
        ...state,
        categorySelected: resetCategorySelected,
      });
      return;
    }

    if (category === "Tất cả" || category === "All") {
      setState({ ...state, categorySelected: [category] });
      return;
    }

    const filterCategoryAll = [...state.categorySelected, category].filter(
      (cate) => cate !== (language === "vi" ? "Tất cả" : "All")
    );
    return setState({ ...state, categorySelected: [...new Set(filterCategoryAll)] });
  };

  const handleSelectedPrice = (price) => {
    console.log(price);
  };

  const handleRefresh = (filterOf) => {
    const newState = {
      ...state,
      [`isOpen${filterOf}`]: false,
      categorySelected: [],
    };

    const newPackagesFiltered = packageArr.filter((pk) => {
      const { targetName, input } = helperFilterSearch(state.inputSearch, pk.nameVi);
      return targetName.includes(input);
    });

    setState(newState);
    setPackagesFiltered(state.inputSearch ? newPackagesFiltered : packageArr);
  };

  const handleFilter = (filterOf) => {
    const isOptionAllSelected =
      state.categorySelected.includes("All") ||
      state.categorySelected.includes("Tất cả") ||
      !state.categorySelected.length;

    const newState = {
      ...state,
      [`isOpen${filterOf}`]: false,
    };

    if (state.inputSearch) {
      setState(newState);
      handleSearchPackages(state.inputSearch);
      return;
    }

    const newPackagesFiltered = isOptionAllSelected
      ? packageArr
      : packageArr.filter((pk) => {
          const typePk = pk.packageType[language === "vi" ? "nameVi" : "nameEn"];
          return state.categorySelected.includes(typePk);
        });
    setState(newState);
    setPackagesFiltered(newPackagesFiltered);
  };

  useEffect(() => {
    if (pageClinicDoctors) {
      dispatch(
        getAllDoctorsById({ nameColumnMap: "clinicId", id: +clinicId, typeRemote: "includeTrueAndFalse" })
      );
    } else {
      dispatch(getAllPackages({ clinicId: +clinicId, specialId: null }));
    }
    dispatch(getAllPackagesType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (packagesType.length > 0) {
      handleOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesType.length]);

  useEffect(() => {
    handleSelectedCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // console.log(state);
  console.log(packagesFiltered);

  return (
    <div className="clinic-carousel-container" onClick={(e) => handleDisplayOptions(e)}>
      {!_.isEmpty(dataClinic) && (
        <>
          <ClinicTop clinicId={+clinicId} dataClinic={dataClinic} />

          <div style={{ borderTop: "1px solid #eee" }}></div>

          <div className="filters u-wrapper">
            <div className="filter-search">
              <InputSearch
                placeholder={language === "vi" ? "Tìm kiếm gói khám bệnh" : "Search for packages examination"}
                icon={<GoSearch />}
                onSearch={handleOnChangeSearch}
                onClickSearch={() => handleSearchPackages(state.inputSearch)}
                onEnterKey={handlePressEnter}
              />
            </div>

            <div className="filter">
              <div
                className="filter-item filter-item--category"
                onClick={(e) => handleDisplayOptions(e, "Category")}
              >
                <span className="filter-item__name">{state.categorySelected.join(", ") || "Danh mục"}</span>
                <span className="filter-item__icon">
                  <svg
                    stroke="%23000000"
                    fill="%23000000"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="20px"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
                    </g>
                  </svg>
                </span>

                <div
                  className={`${state.isOpenCategory ? "filter-select open" : "filter-select"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <strong className="filter-select__title">Lựa chọn danh mục</strong>

                  <div className="filter-options">
                    {state.optionsCategory.length > 0 &&
                      state.optionsCategory.map((category) => {
                        return (
                          <span
                            key={category}
                            className={
                              state.categorySelected.includes(category)
                                ? "filter-options__item filter-options__item--selected"
                                : "filter-options__item"
                            }
                            onClick={(e) => handleSelectedCategory(category)}
                          >
                            {category}
                          </span>
                        );
                      })}
                  </div>

                  <div className="filter-buttons">
                    <button className="filter-button" onClick={() => handleRefresh("Category")}>
                      <SlRefresh />
                    </button>

                    <button className="filter-button" onClick={() => handleFilter("Category")}>
                      <TbFilter />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="filter-item filter-item--price"
                onClick={(e) => handleDisplayOptions(e, "Price")}
              >
                <span className="filter-item__name">Mức giá</span>
                <span className="filter-item__icon">
                  <svg
                    stroke="%23000000"
                    fill="%23000000"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="20px"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
                    </g>
                  </svg>
                </span>

                <div
                  className={`${state.isOpenPrice ? "filter-select open" : "filter-select"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <strong className="filter-select__title">Tìm theo khoảng giá</strong>
                  <div className="filter-select__inputs">
                    <input type="number" placeholder="Từ" />
                    <span> - </span>
                    <input type="number" placeholder="Đến" />
                  </div>
                  <strong className="filter-select__title">Hoặc lựa chọn mức giá</strong>
                  <div className="filter-options">
                    {state.optionsPrice.length > 0 &&
                      state.optionsPrice.map((price, index) => {
                        return (
                          <span
                            key={index}
                            className="filter-options__item"
                            onClick={() => handleSelectedPrice(price)}
                          >
                            {price}
                          </span>
                        );
                      })}
                  </div>
                  <div className="filter-buttons">
                    <button className="filter-button">
                      <SlRefresh />
                    </button>

                    <button className="filter-button">
                      <TbFilter />
                    </button>
                  </div>
                </div>
              </div>

              <div className="refresh">
                <SlRefresh />
              </div>
            </div>
          </div>

          <div className="clinic-doctors u-wrapper">
            {pageClinicDoctors
              ? doctorsById.length > 0 &&
                doctorsById.map((doctor) => {
                  return (
                    <Doctor
                      key={doctor.doctorId}
                      doctorId={doctor.doctorId}
                      onToggleModal={handleModal}
                      doctorData={doctor}
                      assurance
                      needAddress
                      remote={0}
                    />
                  );
                })
              : packagesFiltered.length > 0 &&
                packagesFiltered.map((pk) => {
                  return (
                    <Package
                      key={pk.id}
                      packageId={pk.id}
                      onToggleModal={handleModal}
                      packageData={pk}
                      assurance
                      needAddress
                      packageClinic={1}
                      packageClinicSpecialty={packageClinicSpecialty}
                    />
                  );
                })}
          </div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={() => handleModal()}
              doctorId={state.doctorId ? state.doctorId : ""}
              packageId={state.packageId ? state.packageId : ""}
              doctorData={dataModalBooking(language, state.doctorData, "doctor")}
              packageData={dataModalBooking(language, state.packageData, "package")}
              hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
              remote={0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicCarouselMore;

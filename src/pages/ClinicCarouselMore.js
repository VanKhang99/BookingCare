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
import { TO_USD } from "../utils/constants";
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

  priceFrom: "",
  priceTo: "",
  priceSelected: "",
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
      return newPackagesFiltered;
    }

    setPackagesFiltered(inputSearch ? newPackagesFiltered : packageArr);
    return inputSearch ? newPackagesFiltered : packageArr;
  };

  const doFilterPrice = (arr) => {
    const { priceFrom, priceTo, priceSelected } = state;
    const newPackagesFiltered = arr.filter((pk) => {
      const { price } = pk;
      const priceBaseLanguage = language === "vi" ? +price : +price / 25000;
      console.log(priceBaseLanguage);
      const prices = price.includes("-") ? price.split(" - ") : [price];

      if (priceSelected.includes("Under") || priceSelected.includes("Dưới")) {
        return prices.every((price) => +priceBaseLanguage <= +priceTo);
      }

      if (priceSelected.includes("Over") || priceSelected.includes("Trên")) {
        return prices.every((price) => +priceBaseLanguage > +priceFrom);
      }

      return prices.every((price) => +priceBaseLanguage > +priceFrom && +priceBaseLanguage <= +priceTo);
    });
    return newPackagesFiltered;
  };

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    const packagesSearched = handleSearchPackages(state.inputSearch);
    setPackagesFiltered(packagesSearched);
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

      const changeCategorySelected = packageArr.reduce((acc, pk) => {
        const checkOldSelectedCategory = state.categorySelected.includes(
          pk.packageType[language === "vi" ? "nameEn" : "nameVi"]
        );

        if (checkOldSelectedCategory) {
          acc.push(pk.packageType[language === "vi" ? "nameVi" : "nameEn"]);
        }
        return acc;
      }, []);

      console.log(changeCategorySelected);

      return setState({
        ...state,
        categorySelected: isOptionAllSelected
          ? [language === "vi" ? "Tất cả" : "All"]
          : [...new Set(changeCategorySelected)],
        optionsCategory: categoriesFilter,
        optionsPrice: rangePriceFilter,
      });
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
    const { priceSelected } = state;
    const { categoriesFilter, rangePriceFilter } = optionsFilter();
    const filterPrice = (arr) => {
      return arr
        .filter((price) => price.includes("₫") || price.includes("$"))
        .map((part) => parseInt(part.replace(/[^\d]/g, ""), 10));
    };

    if (!price) {
      const indexPriceSelected = state.optionsPrice.findIndex((price) => price === state.priceSelected);
      const newPriceSelected = rangePriceFilter[indexPriceSelected];
      const splitPrice = newPriceSelected?.split(" ");

      if (!splitPrice) {
        return setState({ ...state, optionsCategory: categoriesFilter, optionsPrice: rangePriceFilter });
      }

      const pricesArr = filterPrice(splitPrice);

      if (splitPrice.includes("Dưới") || splitPrice.includes("Under")) {
        return setState({
          ...state,
          priceSelected: newPriceSelected,
          priceFrom: "",
          priceTo: pricesArr[0],
          optionsCategory: categoriesFilter,
          optionsPrice: rangePriceFilter,
        });
      }

      if (splitPrice.includes("Trên") || splitPrice.includes("Over")) {
        return setState({
          ...state,
          priceSelected: newPriceSelected,
          priceFrom: pricesArr[0],
          priceTo: "",
          optionsCategory: categoriesFilter,
          optionsPrice: rangePriceFilter,
        });
      }

      return setState({
        ...state,
        priceSelected: newPriceSelected,
        priceFrom: pricesArr[0],
        priceTo: pricesArr[1],
        optionsCategory: categoriesFilter,
        optionsPrice: rangePriceFilter,
      });
    }

    if (priceSelected === price) {
      return setState({
        ...state,
        priceSelected: "",
        priceFrom: "",
        priceTo: "",
      });
    }

    const splitPrice = price.split(" ");
    const pricesArr = filterPrice(splitPrice);
    if (pricesArr.length <= 1) {
      if (splitPrice.includes("Dưới") || splitPrice.includes("Under")) {
        return setState({
          ...state,
          priceTo: pricesArr[0],
          priceFrom: "",
          priceSelected: price,
        });
      } else if (splitPrice.includes("Trên") || splitPrice.includes("Over")) {
        return setState({
          ...state,
          priceFrom: pricesArr[0],
          priceTo: "",
          priceSelected: price,
        });
      }
    }

    setState({
      ...state,
      priceFrom: pricesArr[0],
      priceTo: pricesArr[1],
      priceSelected: price,
    });
  };

  const handleOnChangePriceInput = (e, typePrice) => {
    const { value } = e.target;
    const { priceTo, priceFrom } = state;
    const formatter = new Intl.NumberFormat(`${language === "vi" ? "vi-VN" : "en-US"}`, {
      style: "currency",
      currency: `${language === "vi" ? "VND" : "USD"}`,
    });

    const wordFrom = language === "vi" ? "Từ" : "From";
    const wordTo = language === "vi" ? "đến" : "to";
    const wordUnder = language === "vi" ? "Dưới" : "Under";
    const wordOver = language === "vi" ? "Trên" : "Over";

    let formatPriceSelectedToShow;
    if (typePrice === "priceFrom") {
      if (!value && priceTo) {
        formatPriceSelectedToShow = `${wordUnder} ${formatter.format(priceTo)}`;
      } else if (value && !priceTo) {
        formatPriceSelectedToShow = `${wordOver} ${formatter.format(value)}`;
      } else {
        formatPriceSelectedToShow = `${wordFrom} ${formatter.format(value)} ${wordTo} ${formatter.format(
          priceTo
        )}`;
      }
    } else if (typePrice === "priceTo") {
      if (!value && priceFrom) {
        formatPriceSelectedToShow = `${wordOver} ${formatter.format(priceFrom)}`;
      } else if (value && !priceFrom) {
        formatPriceSelectedToShow = `${wordUnder} ${formatter.format(value)}`;
      } else {
        formatPriceSelectedToShow = `${wordFrom} ${formatter.format(priceFrom)} ${wordTo} ${formatter.format(
          value
        )}`;
      }
    }

    setState({
      ...state,
      [typePrice]: value,
      priceSelected: formatPriceSelectedToShow,
    });
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

  const handleFilterByCategory = () => {
    const isOptionAllSelected =
      state.categorySelected.includes("All") ||
      state.categorySelected.includes("Tất cả") ||
      !state.categorySelected.length;

    const newState = {
      ...state,
      isOpenCategory: false,
    };

    if (state.inputSearch) {
      const packagesSearched = handleSearchPackages(state.inputSearch);
      setState(newState);
      setPackagesFiltered(packagesSearched);
      return packagesSearched;
    }

    const newPackagesFiltered = isOptionAllSelected
      ? packageArr
      : packageArr.filter((pk) => {
          const typePk = pk.packageType[language === "vi" ? "nameVi" : "nameEn"];
          return state.categorySelected.includes(typePk);
        });
    setState(newState);
    setPackagesFiltered(newPackagesFiltered);
    return newPackagesFiltered;
  };

  const handleFilterByPrice = () => {
    console.log(state);

    // if(state.categorySelected && state.inputSearch)
    if (state.inputSearch) {
      let newPackagesFiltered = handleSearchPackages(state.inputSearch);
      newPackagesFiltered = doFilterPrice(newPackagesFiltered);
      setState({ ...state, isOpenPrice: false });
      setPackagesFiltered(newPackagesFiltered);
    }

    if (state.categorySelected.length) {
      let newPackagesFiltered = handleFilterByCategory();
      newPackagesFiltered = doFilterPrice(newPackagesFiltered);
      setState({ ...state, isOpenPrice: false });
      setPackagesFiltered(newPackagesFiltered);
      return;
    }

    if (!state.priceSelected) {
      setState({ ...state, isOpenPrice: false });
      setPackagesFiltered(packageArr);
      return;
    }
  };

  console.log(state);

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
    handleSelectedPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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

                    <button className="filter-button" onClick={() => handleFilterByCategory("Category")}>
                      <TbFilter />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="filter-item filter-item--price"
                onClick={(e) => handleDisplayOptions(e, "Price")}
              >
                <span className="filter-item__name">
                  {!state.priceFrom && !state.priceTo ? "Mức giá" : state.priceSelected}
                </span>
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
                    <input
                      type="number"
                      placeholder="Từ"
                      value={state.priceFrom}
                      onChange={(e) => handleOnChangePriceInput(e, "priceFrom")}
                    />
                    <span> - </span>
                    <input
                      type="number"
                      placeholder="Đến"
                      value={state.priceTo}
                      onChange={(e) => handleOnChangePriceInput(e, "priceTo")}
                    />
                  </div>
                  <strong className="filter-select__title">Hoặc lựa chọn mức giá</strong>
                  <div className="filter-options">
                    {state.optionsPrice.length > 0 &&
                      state.optionsPrice.map((price, index) => {
                        return (
                          <span
                            key={index}
                            className={
                              state.priceSelected === price
                                ? "filter-options__item filter-options__item--selected"
                                : "filter-options__item"
                            }
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

                    <button className="filter-button" onClick={() => handleFilterByPrice("Price")}>
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

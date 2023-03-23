import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// import FilterPrice from "./FilterPrice";
// import FilterCategory from "./FilterCategory";
import { InputSearch } from "../../components";
import { IoClose } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import { SlRefresh } from "react-icons/sl";
import { TbFilter } from "react-icons/tb";
import { TO_USD } from "../../utils/constants";
import { getAllCategories } from "../../slices/categorySlice";
import {
  formatterPrice,
  helperFilterSearch,
  helperDisplayNameDoctor,
  helperCreateCategory,
} from "../../utils/helpers";
import "../../styles/Filter.scss";

const initialState = {
  inputSearch: "",

  optionsCategory: [],
  categorySelected: [],
  isOpenCategory: false,

  optionsPrice: [],
  priceSelected: "",
  priceFrom: "",
  priceTo: "",
  isOpenPrice: false,

  inputSearchClinic: "",
  clinicSelected: [],
  optionsClinic: [],
  isOpenClinic: false,
};

const Filter = ({
  packageClinicSpecialty,
  pageClinicDoctors,
  categoryId,
  doctorsById,
  packageArr,
  dataFiltered,
  onFilteredData,
  onHideCategoryIntro,
  haveFilterByClinicsAndCity,
}) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { categories } = useSelector((store) => store.category);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(`${language === "vi" ? "vi-VN" : "en-US"}`, {
        style: "currency",
        currency: `${language === "vi" ? "VND" : "USD"}`,
      }),
    [language]
  );

  const optionsFilter = () => {
    let categoriesFilter;
    if (pageClinicDoctors) {
      categoriesFilter = helperCreateCategory(doctorsById, "clinicDoctor");
    } else if (packageClinicSpecialty) {
      categoriesFilter = helperCreateCategory(packageArr, "clinicSpecialty");
    } else {
      categoriesFilter = helperCreateCategory(categories, "clinicPackage");
    }

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

    // option clinics and city,district
    let clinicsFilter;
    let citiesFilter;
    if (haveFilterByClinicsAndCity) {
      //CLINICS
      clinicsFilter = helperCreateCategory(packageArr, "clinic");

      //CITIES
      citiesFilter = [
        {
          id: 1,
          nameEn: "Ho Chi Minh City",
          nameVi: "Thành phố Hồ Chí Minh",
          districtEn: [],
          districtVi: [],
        },
        { id: 2, nameEn: "Ha Noi City", nameVi: "Thành phố Hà Nội", districtEn: [], districtVi: [] },
      ];

      citiesFilter = packageArr.reduce((acc, pk, index) => {
        const { clinicData } = pk;
        const citySplitted = clinicData.address.split(" - ").at(-1);
        const districtSplitted = clinicData.address.split(" - ").filter((item) => item.includes("Quận"))[0];
        //Find index city need to add district dynamic
        const cityIndex = citiesFilter.findIndex((city) => city.nameVi === citySplitted);

        if (cityIndex !== -1) {
          //Check district is already existed or not
          const districtIndex = acc[cityIndex].districtVi.indexOf(districtSplitted);
          if (districtIndex === -1) {
            acc[cityIndex].districtEn.push(
              /\d/.test(districtSplitted)
                ? districtSplitted.replace("Quận", "District")
                : `${districtSplitted.replace("Quận", "").trim()} District`
            );
            acc[cityIndex].districtVi.push(districtSplitted);
          }
        }
        return acc;
      }, citiesFilter);
    }

    return { categoriesFilter, rangePriceFilter, clinicsFilter, citiesFilter };
  };

  const handleOptions = () => {
    const { categoriesFilter, rangePriceFilter, citiesFilter, clinicsFilter } = optionsFilter();

    setState({
      ...state,
      optionsCategory: categoriesFilter,
      optionsPrice: rangePriceFilter,
      optionsClinic: clinicsFilter,
    });

    if (categoryId) {
      const packageToRender = packageArr.filter((pk) => pk.categoryId.includes(categoryId));
      onFilteredData(packageToRender);
      return;
    }

    pageClinicDoctors
      ? onFilteredData(dataFiltered.length > 0 ? dataFiltered : doctorsById)
      : onFilteredData(dataFiltered.length > 0 ? dataFiltered : packageArr);
    return;
  };

  const handleDisplayOptions = (optionsOf) => {
    setState((prevState) => {
      const { isOpenCategory, isOpenPrice, isOpenClinic } = prevState;
      switch (optionsOf) {
        case "Category":
          return { ...prevState, isOpenCategory: !isOpenCategory, isOpenPrice: false, isOpenClinic: false };
        case "Price":
          return { ...prevState, isOpenPrice: !isOpenPrice, isOpenCategory: false, isOpenClinic: false };
        case "Clinic":
          return { ...prevState, isOpenClinic: !isOpenClinic, isOpenCategory: false, isOpenPrice: false };
        default:
          return prevState;
      }
    });
  };

  //SEARCH
  const handleOnChangeSearch = (e, searchOf = undefined) => {
    if (searchOf === "clinic") {
      const { clinicsFilter } = optionsFilter();
      const clinicSearched = clinicsFilter.filter((clinic) => {
        const targetCompare = language === "vi" ? clinic.nameVi : clinic.nameEn;
        const { targetName, input } = helperFilterSearch(e.target.value, targetCompare);
        return targetName.includes(input);
      });

      return setState({ ...state, optionsClinic: clinicSearched, inputSearchClinic: e.target.value });
    }
    return setState({ ...state, inputSearch: e.target.value });
  };

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    handleFilter();
  };

  const filterBySearch = (inputSearch) => {
    const compare = (arr) => {
      return arr.filter((data) => {
        const targetCompare = pageClinicDoctors ? helperDisplayNameDoctor(data) : data.nameVi;
        const { targetName, input } = helperFilterSearch(inputSearch, targetCompare);
        return targetName.includes(input);
      });
    };

    const newPackagesFiltered = compare(pageClinicDoctors ? doctorsById : packageArr);

    if (inputSearch) {
      return newPackagesFiltered;
    }

    return pageClinicDoctors ? doctorsById : packageArr;
  };

  //COMMON FUNCTION FILTER BY CATEGORY AND CLINIC
  const handleSelectedOption = (data, selectedOf) => {
    const { categorySelected, clinicSelected } = state;
    const arrCheck = selectedOf === "clinic" ? clinicSelected : categorySelected;
    const checkOptionSelectedBefore = () => {
      return arrCheck.some((oldOptionSelected) => oldOptionSelected.nameVi === data.nameVi);
    };

    if (checkOptionSelectedBefore()) {
      const resetOptionsSelected = arrCheck.filter(
        (oldOptionSelected) => oldOptionSelected.nameVi !== data.nameVi
      );
      setState({
        ...state,
        [`${selectedOf}Selected`]: resetOptionsSelected,
      });
      return;
    }

    if (!data.id) {
      setState({ ...state, [`${selectedOf}Selected`]: [data] });
      return;
    }

    const filterOptionAll = [...arrCheck, data].filter((item) => item.id);
    return setState({ ...state, [`${selectedOf}Selected`]: [...new Set(filterOptionAll)] });
  };

  //FILTER BY CATEGORY
  const helperFilterCategory = (arr) => {
    if (pageClinicDoctors) {
      const specialtiesName = state.categorySelected.map((specialty) => specialty.nameVi);
      return arr.filter((data) => {
        return specialtiesName.includes(data.specialtyData.nameVi);
      });
    }

    const newPackagesFiltered = arr.filter((data) => {
      const categoryIds = data.categoryId.split(", ").map((item) => +item);
      return state.categorySelected.some((cate) => categoryIds.includes(cate.id));
    });

    return newPackagesFiltered;
  };

  const filterByCategory = (arr) => {
    const isOptionAllSelected =
      state.categorySelected.some((cate) => !cate.id) || !state.categorySelected.length;

    if (isOptionAllSelected) {
      return arr;
    }

    const newPackagesFiltered = helperFilterCategory(arr || (pageClinicDoctors ? doctorsById : packageArr));
    return newPackagesFiltered;
  };

  const displayCategory = () => {
    if (!state.categorySelected.length) return null;
    return state.categorySelected.map((cate) => (language === "vi" ? cate.nameVi : cate.nameEn));
  };

  // FILTER BY PRICE
  const handleGetPrices = (arr) => {
    return arr
      .filter((price) => price.includes("₫") || price.includes("$"))
      .map((part) => parseInt(part.replace(/[^\d]/g, ""), 10));
  };

  const handleSelectedPrice = (price) => {
    const { priceSelected } = state;

    if (priceSelected === price) {
      return setState({
        ...state,
        priceSelected: "",
        priceFrom: "",
        priceTo: "",
      });
    }

    const splitPrice = price.split(" ");
    const pricesArr = handleGetPrices(splitPrice);
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

  const preprocessFilterPrice = (arr) => {
    return arr.map(({ price }) => price.split(" - ").map((p) => (language === "vi" ? +p : +p / 25000)));
  };

  const filterByPrice = (arr) => {
    const { priceFrom, priceTo, priceSelected } = state;
    if (!priceSelected || (!priceTo && !priceFrom)) return arr;

    const prices = preprocessFilterPrice(arr);

    const newPackagesFiltered = arr.filter((pk, i) => {
      const price = prices[i];
      if (!price) return false;

      if (priceSelected.includes("Under") || priceSelected.includes("Dưới")) {
        return price.every((p) => +p <= +priceTo);
      }

      if (priceSelected.includes("Over") || priceSelected.includes("Trên")) {
        return price.every((p) => +p > +priceFrom);
      }

      return price.every((p) => +p >= +priceFrom && +p <= +priceTo);
    });
    return newPackagesFiltered;
  };

  // FILTER BY CLINIC
  const helperFilterClinic = (arr) => {
    const specialtiesName = state.clinicSelected.map((specialty) => specialty.nameVi);
    const newPackagesFiltered = arr.filter((data) => {
      return specialtiesName.includes(data.clinicData.nameVi);
    });

    return newPackagesFiltered;
  };

  const filterByClinic = (arr) => {
    const isOptionAllSelected = state.clinicSelected.some((cate) => !cate.id) || !state.clinicSelected.length;

    if (isOptionAllSelected) {
      return arr;
    }

    const newPackagesFiltered = helperFilterClinic(arr);
    return newPackagesFiltered;
  };

  const displayClinic = () => {
    if (!state.clinicSelected.length) return null;
    return state.clinicSelected.map((cate) => (language === "vi" ? cate.nameVi : cate.nameEn));
  };

  // EXECUTE FEATURE
  const handleFilter = () => {
    let newPackagesFiltered;

    if (state.inputSearch) {
      newPackagesFiltered = filterBySearch(state.inputSearch);
    }

    if (state.categorySelected.length) {
      newPackagesFiltered = filterByCategory(newPackagesFiltered);
    }

    if (state.priceSelected) {
      newPackagesFiltered = filterByPrice(
        newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr)
      );
    }

    if (state.clinicSelected.length) {
      newPackagesFiltered = filterByClinic(newPackagesFiltered);
    }

    setState({ ...state, isOpenCategory: false, isOpenPrice: false, isOpenClinic: false });
    onFilteredData(newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr));
    onHideCategoryIntro();
    return;
  };

  const handleRefresh = (refreshOf) => {
    const arrBelongToProps = pageClinicDoctors ? doctorsById : packageArr;
    if (!refreshOf) {
      setState({
        ...state,
        priceSelected: "",
        priceTo: "",
        priceFrom: "",
        isOpenPrice: false,

        categorySelected: [],
        isOpenCategory: false,

        inputSearchClinic: "",
        clinicSelected: [],
        isOpenClinic: false,

        inputSearch: "",
      });
      onFilteredData(arrBelongToProps);
      onHideCategoryIntro();
      return;
    }

    let newPackagesFiltered;
    if (state.inputSearch) {
      newPackagesFiltered = filterBySearch(state.inputSearch);
    }

    if (refreshOf === "Category") {
      if (state.priceSelected) {
        newPackagesFiltered = filterByPrice(newPackagesFiltered || arrBelongToProps);
      }

      if (state.clinicSelected.length) {
        newPackagesFiltered = filterByClinic(newPackagesFiltered || arrBelongToProps);
      }

      setState({
        ...state,
        isOpenCategory: false,
        isOpenPrice: false,
        isOpenClinic: false,
        categorySelected: [],
      });
      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
      onHideCategoryIntro();
      return;
    }

    if (refreshOf === "Price") {
      if (state.categorySelected) {
        newPackagesFiltered = filterByCategory(newPackagesFiltered || arrBelongToProps);
      }

      if (state.clinicSelected.length) {
        newPackagesFiltered = filterByClinic(newPackagesFiltered || arrBelongToProps);
      }

      setState({
        ...state,
        isOpenCategory: false,
        isOpenPrice: false,
        isOpenClinic: false,
        priceSelected: "",
        priceTo: "",
        priceFrom: "",
      });

      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
      onHideCategoryIntro();
      return;
    }

    if (refreshOf === "Clinic") {
      if (state.categorySelected) {
        newPackagesFiltered = filterByCategory(newPackagesFiltered || arrBelongToProps);
      }

      if (state.priceSelected) {
        newPackagesFiltered = filterByPrice(newPackagesFiltered || arrBelongToProps);
      }

      setState({
        ...state,
        isOpenCategory: false,
        isOpenPrice: false,
        isOpenClinic: false,
        inputSearchClinic: "",
        clinicSelected: [],
      });
      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
      onHideCategoryIntro();
    }
  };

  const handleStateChangeLanguage = () => {
    const { priceSelected } = state;
    const { categoriesFilter, rangePriceFilter } = optionsFilter();

    //CATEGORY INITIAL FROM PAGE PACKAGES
    const checkCategory = categoryId
      ? categoriesFilter.filter((category) => category.id === +categoryId)
      : state.categorySelected;

    // PRICE
    const indexPriceSelected = state.optionsPrice.findIndex((price) => price === priceSelected);
    const newPriceSelected =
      indexPriceSelected !== -1 ? rangePriceFilter[indexPriceSelected] : state.priceSelected;
    const splitPrice = newPriceSelected?.split(" ");

    if (!splitPrice) {
      return setState({
        ...state,
        categorySelected: checkCategory,
        optionsCategory: categoriesFilter,
        optionsPrice: rangePriceFilter,
        priceSelected: rangePriceFilter,
      });
    }

    const pricesArr = handleGetPrices(splitPrice);
    const wordFrom = language === "vi" ? "Từ" : "From";
    const wordTo = language === "vi" ? "đến" : "to";
    const wordUnder = language === "vi" ? "Dưới" : "Under";
    const wordOver = language === "vi" ? "Trên" : "Over";
    const pricePassToState = (price) => {
      if (indexPriceSelected !== -1) {
        return price;
      }
      return language === "vi" ? Math.ceil(price * TO_USD) : Math.ceil(price / TO_USD);
    };

    const priceBaseLanguage = (price) =>
      language === "vi"
        ? formatter.format(Math.ceil(price * TO_USD))
        : formatter.format(Math.ceil(price / TO_USD)).replace(/\.0+$/, "");

    let formatSelectedPrice;
    if (splitPrice.includes("Dưới") || splitPrice.includes("Under")) {
      formatSelectedPrice =
        indexPriceSelected !== -1 ? newPriceSelected : `${wordUnder} ${priceBaseLanguage(pricesArr[0])}`;

      return setState({
        ...state,
        categorySelected: checkCategory,
        priceSelected: formatSelectedPrice,
        priceFrom: "",
        priceTo: pricePassToState(pricesArr[0]),
        optionsCategory: categoriesFilter,
        optionsPrice: rangePriceFilter,
      });
    }

    if (splitPrice.includes("Trên") || splitPrice.includes("Over")) {
      formatSelectedPrice =
        indexPriceSelected !== -1 ? newPriceSelected : `${wordOver} ${priceBaseLanguage(pricesArr[0])}`;

      return setState({
        ...state,
        categorySelected: checkCategory,
        priceSelected: formatSelectedPrice,
        priceFrom: pricePassToState(pricesArr[0]),
        priceTo: "",
        optionsCategory: categoriesFilter,
        optionsPrice: rangePriceFilter,
      });
    }

    formatSelectedPrice =
      indexPriceSelected !== -1
        ? newPriceSelected
        : `${wordFrom} ${priceBaseLanguage(pricesArr[0])} ${wordTo} ${priceBaseLanguage(pricesArr[1])}`;

    return setState({
      ...state,
      categorySelected: checkCategory,
      priceSelected:
        !state.priceTo && !state.priceFrom ? t("clinic-carousel-more.price") : state.priceSelected,
      priceFrom: !state.priceFrom ? "" : pricePassToState(pricesArr[0]),
      priceTo: !state.priceFrom ? "" : pricePassToState(pricesArr[1]),
      optionsCategory: categoriesFilter,
      optionsPrice: rangePriceFilter,
    });
  };

  useEffect(() => {
    dispatch(getAllCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      handleOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length, packageArr.length]);

  useEffect(() => {
    handleStateChangeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, categories.length]);

  // console.log(state);

  return (
    <div className="filters u-wrapper">
      <div className="filter-search">
        <InputSearch
          placeholder={
            pageClinicDoctors
              ? t("clinic-carousel-more.placeholder-search-doctor")
              : t("clinic-carousel-more.placeholder-search-package")
          }
          icon={<GoSearch />}
          onSearch={handleOnChangeSearch}
          onClickSearch={() => handleFilter()}
          onEnterKey={handlePressEnter}
          value={state.inputSearch}
        />

        <button className="refresh" onClick={() => handleRefresh()}>
          <SlRefresh />
        </button>
      </div>

      <div className="filter">
        <div className="filter-item filter-item--category" onClick={() => handleDisplayOptions("Category")}>
          <div className="filter-item__name">
            {displayCategory()?.join(", ") || t("clinic-carousel-more.category")}
          </div>
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
            <div className="filter-select__title">
              <span>{t("clinic-carousel-more.choose-category")}</span>
              <IoClose onClick={() => setState({ ...state, isOpenCategory: false })} />
            </div>

            <div className="filter-options">
              {state.optionsCategory.length > 0 &&
                state.optionsCategory.map((category) => {
                  return (
                    <span
                      key={category.id}
                      className={
                        state.categorySelected.some((cate) => cate.id === category.id)
                          ? "filter-options__item filter-options__item--selected"
                          : "filter-options__item"
                      }
                      onClick={() => handleSelectedOption(category, "category")}
                    >
                      {language === "vi" ? category.nameVi : category.nameEn}
                    </span>
                  );
                })}
            </div>

            <div className="filter-buttons">
              <button className="filter-buttons__refresh" onClick={() => handleRefresh("Category")}>
                <SlRefresh />
              </button>
              <button className="filter-buttons__filter" onClick={() => handleFilter()}>
                <TbFilter />
              </button>
            </div>
          </div>
        </div>

        <div className="filter-item filter-item--price" onClick={() => handleDisplayOptions("Price")}>
          <span className="filter-item__name">
            {state.priceSelected ? state.priceSelected : t("clinic-carousel-more.price")}
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
            <div className="filter-select__title">
              <span>{t("clinic-carousel-more.find-by-range")}</span>
              <IoClose onClick={() => setState({ ...state, isOpenPrice: false })} />
            </div>

            <div className="filter-select__inputs">
              <input
                type="number"
                placeholder={language === "vi" ? "Từ" : "From"}
                value={state.priceFrom || ""}
                onChange={(e) => handleOnChangePriceInput(e, "priceFrom")}
              />
              <span> - </span>
              <input
                type="number"
                placeholder={language === "vi" ? "Đến" : "To"}
                value={state.priceTo || ""}
                onChange={(e) => handleOnChangePriceInput(e, "priceTo")}
              />
            </div>
            <strong className="filter-select__title">{t("clinic-carousel-more.or-choose-price")}</strong>
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
              <button className="filter-buttons__refresh" onClick={() => handleRefresh("Price")}>
                <SlRefresh />
              </button>

              <button className="filter-buttons__filter" onClick={() => handleFilter()}>
                <TbFilter />
              </button>
            </div>
          </div>
        </div>

        {haveFilterByClinicsAndCity && (
          <div className="filter-item filter-item--clinic" onClick={() => handleDisplayOptions("Clinic")}>
            <span className="filter-item__name">
              {displayClinic()?.join(", ") || t("clinic-carousel-more.clinic")}
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
              className={`${state.isOpenClinic ? "filter-select open" : "filter-select"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filter-select__title">
                <span>{t("clinic-carousel-more.find-by-name")}</span>
                <IoClose onClick={() => setState({ ...state, isOpenClinic: false })} />
              </div>

              <div className="filter-select__inputs">
                <InputSearch
                  placeholder={language === "vi" ? "Tìm kiếm" : "Search"}
                  onSearch={(e) => handleOnChangeSearch(e, "clinic")}
                  value={state.inputSearchClinic}
                />
              </div>
              <strong className="filter-select__title">{t("clinic-carousel-more.or-choose-clinic")}</strong>
              <div className="filter-options">
                {state.optionsClinic.length > 0 &&
                  state.optionsClinic.map((clinic) => {
                    const { id, nameEn, nameVi } = clinic;
                    return (
                      <span
                        key={id}
                        className={
                          state.clinicSelected.some((oldClinic) => oldClinic.id === clinic.id)
                            ? "filter-options__item filter-options__item--selected"
                            : "filter-options__item"
                        }
                        onClick={() => handleSelectedOption(clinic, "clinic")}
                      >
                        {language === "vi" ? nameVi : nameEn}
                      </span>
                    );
                  })}
              </div>
              <div className="filter-buttons">
                <button className="filter-buttons__refresh" onClick={() => handleRefresh("Clinic")}>
                  <SlRefresh />
                </button>

                <button className="filter-buttons__filter" onClick={() => handleFilter()}>
                  <TbFilter />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;

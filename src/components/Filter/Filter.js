import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

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

  citySelected: {},
  inputSearchDistrict: "",
  districtSelected: [],
  optionsRegion: [],
  isOpenRegion: false,
  allowChooseDistrict: false,

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
  clinicId,
  doctorsById,
  packageArr,
  dataFiltered,
  onFilteredData,
  haveFilterByClinicsAndCity,
  onBackInitialInterface,
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
          districts: [],
        },
        { id: 2, nameEn: "Ha Noi City", nameVi: "Thành phố Hà Nội", districts: [] },
      ];

      citiesFilter = packageArr.reduce((acc, pk, index) => {
        const citySplitted = pk.address.split(" - ").at(-1);
        const districtSplitted = pk.address.split(" - ").filter((item) => item.includes("Quận"))[0];

        //Find index city need to add district dynamic
        const cityIndex = citiesFilter.findIndex((city) => city.nameVi === citySplitted);

        if (cityIndex !== -1) {
          //Check district is already existed or not
          const districtIndex = acc[cityIndex].districts.some((dist) => dist.nameVi === districtSplitted);
          if (!districtIndex) {
            acc[cityIndex].districts.push({
              id: index + 1,
              nameEn: /\d/.test(districtSplitted)
                ? districtSplitted?.replace("Quận", "District")
                : `${districtSplitted?.replace("Quận", "").trim()} District`,
              nameVi: districtSplitted,
            });
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
      optionsRegion: citiesFilter,
      optionsCategory: categoriesFilter,
      optionsPrice: rangePriceFilter,
      optionsClinic: clinicsFilter,
    });

    if (!dataFiltered.length) {
      return onFilteredData(pageClinicDoctors ? doctorsById : packageArr, true);
    }

    onFilteredData(dataFiltered, true);
    return;
  };

  const handleDisplayOptions = (optionsOf) => {
    setState((prevState) => {
      const { isOpenRegion, isOpenCategory, isOpenPrice, isOpenClinic } = prevState;
      switch (optionsOf) {
        case "Region":
          return {
            ...prevState,
            isOpenRegion: !isOpenRegion,
            isOpenPrice: false,
            isOpenClinic: false,
            isOpenCategory: false,
          };
        case "Category":
          return {
            ...prevState,
            isOpenCategory: !isOpenCategory,
            isOpenPrice: false,
            isOpenClinic: false,
            isOpenRegion: false,
          };
        case "Price":
          return {
            ...prevState,
            isOpenPrice: !isOpenPrice,
            isOpenCategory: false,
            isOpenClinic: false,
            isOpenRegion: false,
          };
        case "Clinic":
          return {
            ...prevState,
            isOpenClinic: !isOpenClinic,
            isOpenCategory: false,
            isOpenPrice: false,
            isOpenRegion: false,
          };
        default:
          return prevState;
      }
    });
  };

  //SEARCH
  const handleOnChangeSearch = (e, searchOf = undefined) => {
    const helperSearch = (arr) => {
      return arr.filter((data) => {
        const targetCompare = language === "vi" ? data.nameVi : data.nameEn;
        const { targetName, input } = helperFilterSearch(e.target.value, targetCompare);
        return targetName.includes(input);
      });
    };

    if (searchOf === "district") {
      const { citiesFilter } = optionsFilter();
      const cityToSearchDistrict = citiesFilter.find((city) => city.nameVi === state.citySelected.nameVi);
      const districtSearched = helperSearch(cityToSearchDistrict.districts);

      return setState({
        ...state,
        citySelected: { ...state.citySelected, districts: districtSearched },
        inputSearchDistrict: e.target.value,
      });
    }

    if (searchOf === "clinic") {
      const { clinicsFilter } = optionsFilter();
      const clinicSearched = helperSearch(clinicsFilter);
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

  //COMMON FUNCTION FILTER BY CATEGORY AND CLINIC, CITY
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

  const displayOptionsSelected = (displayOf) => {
    const { categorySelected, clinicSelected, citySelected } = state;

    if (!categorySelected?.length && !clinicSelected?.length && !Object.keys(citySelected)?.length) {
      return null;
    }

    if (displayOf === "city") {
      return language === "vi" ? citySelected.nameVi : citySelected.nameEn;
    }

    return state[`${displayOf}Selected`].map((data) => (language === "vi" ? data.nameVi : data.nameEn));
  };

  const filterByCategoryAndClinic = (arr, filterOf) => {
    const isOptionAllSelected =
      state[`${filterOf}Selected`].some((data) => !data.id) || !state[`${filterOf}Selected`].length;

    if (isOptionAllSelected) {
      return arr;
    }

    const newPackagesFiltered = filterOf === "category" ? helperFilterCategory(arr) : helperFilterClinic(arr);
    return newPackagesFiltered;
  };

  //FILTER BY CATEGORY
  const helperFilterCategory = (arr) => {
    if (!arr?.length) return [];

    if (packageClinicSpecialty) {
      return arr;
    }

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

  // FILTER BY REGION
  const handleSelectedCity = (city) => {
    const { citySelected } = state;
    const citySelectedBefore = citySelected.nameVi === city.nameVi;

    if (citySelectedBefore) {
      return setState({
        ...state,
        citySelected: {},
        districtSelected: [],
        allowChooseDistrict: false,
      });
    }

    setState({
      ...state,
      citySelected: city,
      districtSelected: [],
      allowChooseDistrict: true,
    });
  };

  const handleSelectedDistrict = (district) => {
    const { districtSelected } = state;
    const districtSelectedBefore = districtSelected.filter((dist) => dist.nameVi !== district.nameVi);

    if (districtSelectedBefore.length !== districtSelected.length) {
      return setState({
        ...state,
        districtSelected: districtSelectedBefore,
      });
    }

    setState({
      ...state,
      districtSelected: [...state.districtSelected, district],
    });
  };

  const filterByRegion = (arr, filterBy) => {
    const { citySelected, districtSelected } = state;

    let newPackagesFiltered;
    // console.log(arr);
    // console.log(filterBy);
    // console.log(state.citySelected);

    if (filterBy === "city") {
      newPackagesFiltered = arr.filter((data) => {
        return data.address.includes(citySelected.nameVi);
      });
    }

    if (filterBy === "district") {
      const splitDistrictToFilter = districtSelected.map((district) => district.nameVi);

      newPackagesFiltered = arr.filter((data) => {
        const districtSplitted = data.address.split(" - ").filter((item) => item.includes("Quận"))[0];
        return splitDistrictToFilter.includes(districtSplitted) && data.address.includes(citySelected.nameVi);
      });
    }

    return newPackagesFiltered;
  };

  // EXECUTE FEATURE
  const handleFilter = () => {
    const { inputSearch, citySelected, districtSelected, categorySelected, priceSelected, clinicSelected } =
      state;
    let newPackagesFiltered;

    if (inputSearch) {
      newPackagesFiltered = filterBySearch(inputSearch);
    }

    if (Object.keys(citySelected).length && !districtSelected.length) {
      newPackagesFiltered = filterByRegion(newPackagesFiltered || packageArr, "city");
    } else if (Object.keys(citySelected).length && districtSelected.length) {
      newPackagesFiltered = filterByRegion(newPackagesFiltered || packageArr, "district");
    }

    if (categorySelected.length) {
      newPackagesFiltered = filterByCategoryAndClinic(
        newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr),
        "category"
      );
    }

    if (priceSelected) {
      newPackagesFiltered = filterByPrice(
        newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr)
      );
    }

    if (clinicSelected && clinicSelected.length) {
      newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || packageArr, "clinic");
    }

    setState({
      ...state,
      isOpenRegion: false,
      isOpenCategory: false,
      isOpenPrice: false,
      isOpenClinic: false,
    });
    onFilteredData(newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr));

    return;
  };

  const handleRefresh = (refreshOf) => {
    const arrBelongToProps = pageClinicDoctors ? doctorsById : packageArr;
    if (!refreshOf) {
      setState({
        ...state,
        citySelected: {},
        inputSearchDistrict: "",
        districtSelected: [],
        isOpenRegion: false,
        allowChooseDistrict: false,

        categorySelected: [],
        isOpenCategory: false,

        priceSelected: "",
        priceTo: "",
        priceFrom: "",
        isOpenPrice: false,

        inputSearchClinic: "",
        clinicSelected: [],
        isOpenClinic: false,

        inputSearch: "",
      });
      onFilteredData(arrBelongToProps);

      if (!categoryId && !clinicId && !packageClinicSpecialty) {
        onBackInitialInterface();
      }
      return;
    }

    let newPackagesFiltered;
    // COMMON OF 4 FILTER
    if (state.inputSearch) {
      newPackagesFiltered = filterBySearch(state.inputSearch);
    }

    if (refreshOf === "Region") {
      if (state.categorySelected) {
        newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || arrBelongToProps, "category");
      }

      if (state.priceSelected) {
        newPackagesFiltered = filterByPrice(newPackagesFiltered || arrBelongToProps);
      }

      if (state.clinicSelected.length) {
        newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || arrBelongToProps, "clinic");
      }

      setState({
        ...state,
        citySelected: {},
        inputSearchDistrict: "",
        districtSelected: [],
        isOpenRegion: false,
        allowChooseDistrict: false,
      });
      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
      return;
    }

    // COMMON OF 3 FILTER CATEGORY, PRICE, CLINICS
    if (Object.keys(state.citySelected).length && !state.districtSelected.length) {
      newPackagesFiltered = filterByRegion(newPackagesFiltered || packageArr, "city");
    } else if (Object.keys(state.citySelected).length && state.districtSelected.length) {
      newPackagesFiltered = filterByRegion(newPackagesFiltered || packageArr, "district");
    }

    if (refreshOf === "Category") {
      if (state.priceSelected) {
        newPackagesFiltered = filterByPrice(newPackagesFiltered || arrBelongToProps);
      }

      if (state.clinicSelected.length) {
        newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || arrBelongToProps, "clinic");
      }

      setState({
        ...state,
        isOpenCategory: false,
        categorySelected: [],
      });
      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
      return;
    }

    if (refreshOf === "Price") {
      if (state.categorySelected) {
        newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || arrBelongToProps, "category");
      }

      if (state.clinicSelected.length) {
        newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || arrBelongToProps, "clinic");
      }

      setState({
        ...state,
        isOpenPrice: false,
        priceSelected: "",
        priceTo: "",
        priceFrom: "",
      });

      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
      return;
    }

    if (refreshOf === "Clinic") {
      if (state.categorySelected) {
        newPackagesFiltered = filterByCategoryAndClinic(newPackagesFiltered || arrBelongToProps, "category");
      }

      if (state.priceSelected) {
        newPackagesFiltered = filterByPrice(newPackagesFiltered || arrBelongToProps);
      }

      setState({
        ...state,
        isOpenClinic: false,
        inputSearchClinic: "",
        clinicSelected: [],
      });
      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBelongToProps);
    }
  };

  const handleStateChangeLanguage = () => {
    const { priceSelected } = state;
    const { categoriesFilter, rangePriceFilter, clinicsFilter } = optionsFilter();

    //CATEGORY INITIAL FROM PAGE PACKAGES
    const checkCategory = categoryId
      ? categoriesFilter.filter((category) => category.id === +categoryId)
      : state.categorySelected;

    //CLINIC INITIAL FROM PAGE PACKAGES WHEN CLICK CLINIC
    const checkClinic = clinicId
      ? clinicsFilter?.filter((clinic) => clinic.id === +clinicId)
      : state.clinicSelected;

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
        clinicSelected: checkClinic,
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
        clinicSelected: checkClinic,
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
        clinicSelected: checkClinic,
      });
    }

    formatSelectedPrice =
      indexPriceSelected !== -1
        ? newPriceSelected
        : `${wordFrom} ${priceBaseLanguage(pricesArr[0])} ${wordTo} ${priceBaseLanguage(pricesArr[1])}`;

    return setState({
      ...state,
      categorySelected: checkCategory,
      priceSelected: !state.priceTo && !state.priceFrom ? t("filter.price") : state.priceSelected,
      priceFrom: !state.priceFrom ? "" : pricePassToState(pricesArr[0]),
      priceTo: !state.priceFrom ? "" : pricePassToState(pricesArr[1]),
      optionsCategory: categoriesFilter,
      optionsPrice: rangePriceFilter,
      clinicSelected: checkClinic,
    });
  };

  useEffect(() => {
    if (categories.length) return;

    const dispatchedThunk = dispatch(getAllCategories());

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      handleOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories?.length, packageArr?.length]);

  useEffect(() => {
    handleStateChangeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, categories.length, state.optionsClinic.length]);

  return (
    <div className="filters-container u-wrapper">
      <div className="filters-search">
        <InputSearch
          placeholder={
            pageClinicDoctors ? t("filter.placeholder-search-doctor") : t("filter.placeholder-search-package")
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

      <div className="filters">
        {haveFilterByClinicsAndCity && (
          <div className="filter filter--region" onClick={() => handleDisplayOptions("Region")}>
            <div className="filter__name">{displayOptionsSelected("city") || t("filter.area")}</div>
            <span className="filter__icon">
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
              className={`${state.isOpenRegion ? "filter-select open" : "filter-select"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filter-select__title">
                <span>{t("filter.choose-city")}</span>
                <IoClose onClick={() => setState({ ...state, isOpenRegion: false })} />
              </div>

              <div className="filter-options">
                {state.optionsRegion.length > 0 &&
                  state.optionsRegion.map((region) => {
                    return (
                      <span
                        key={region.id}
                        className={
                          state.citySelected.id === region.id
                            ? "filter-options__item filter-options__item--selected"
                            : "filter-options__item"
                        }
                        onClick={() => handleSelectedCity(region)}
                      >
                        {language === "vi" ? region.nameVi : region.nameEn}
                      </span>
                    );
                  })}
              </div>

              {state.allowChooseDistrict && (
                <>
                  <strong className="filter-select__title filter-select__title--district">
                    {t("filter.choose-district")}
                  </strong>

                  <div className="filter-select__inputs">
                    <InputSearch
                      placeholder={language === "vi" ? "Tìm kiếm" : "Search"}
                      onSearch={(e) => handleOnChangeSearch(e, "district")}
                      value={state.inputSearchDistrict}
                    />
                  </div>

                  <div className="filter-options">
                    {state.citySelected.districts.length > 0 &&
                      state.citySelected.districts.map((district) => {
                        const { id, nameVi, nameEn } = district;
                        return (
                          <span
                            key={id}
                            className={
                              state.districtSelected.some((dist) => dist.nameVi === nameVi)
                                ? "filter-options__item filter-options__item--selected"
                                : "filter-options__item"
                            }
                            onClick={() => handleSelectedDistrict(district)}
                          >
                            {language === "vi" ? nameVi : nameEn}
                          </span>
                        );
                      })}
                  </div>
                </>
              )}

              <div className="filter-buttons">
                <button className="filter-buttons__refresh" onClick={() => handleRefresh("Region")}>
                  <SlRefresh />
                </button>
                <button className="filter-buttons__filter" onClick={() => handleFilter()}>
                  <TbFilter />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="filter filter--category" onClick={() => handleDisplayOptions("Category")}>
          <div className="filter__name">
            {displayOptionsSelected("category")?.join(", ") || t("filter.category")}
            {/* {t("filter.category")} */}
          </div>
          <span className="filter__icon">
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
              <span>{t("filter.choose-category")}</span>
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

        <div className="filter filter--price" onClick={() => handleDisplayOptions("Price")}>
          <span className="filter__name">
            {state.priceSelected ? state.priceSelected : t("filter.price")}
          </span>
          <span className="filter__icon">
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
              <span>{t("filter.find-by-range")}</span>
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
            <strong className="filter-select__title">{t("filter.or-choose-price")}</strong>
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
          <div className="filter filter--clinic" onClick={() => handleDisplayOptions("Clinic")}>
            <span className="filter__name">
              {displayOptionsSelected("clinic")?.join(", ") || t("filter.clinic")}
            </span>
            <span className="filter__icon">
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
                <span>{t("filter.find-by-name")}</span>
                <IoClose onClick={() => setState({ ...state, isOpenClinic: false })} />
              </div>

              <div className="filter-select__inputs">
                <InputSearch
                  placeholder={language === "vi" ? "Tìm kiếm" : "Search"}
                  onSearch={(e) => handleOnChangeSearch(e, "clinic")}
                  value={state.inputSearchClinic}
                />
              </div>
              <strong className="filter-select__title">{t("filter.or-choose-clinic")}</strong>
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

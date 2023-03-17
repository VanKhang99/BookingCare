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
import { getAllPackagesType } from "../../slices/packageTypeSlice";
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
};

const Filter = ({
  packageClinicSpecialty,
  pageClinicDoctors,
  doctorsById,
  packageArr,
  dataFiltered,
  onFilteredData,
}) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { packagesType } = useSelector((store) => store.packageType);
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
      categoriesFilter = helperCreateCategory(doctorsById, "doctor", language);
    } else if (packageClinicSpecialty) {
      categoriesFilter = helperCreateCategory(packageArr, "clinicSpecialty", language);
    } else {
      categoriesFilter = helperCreateCategory(packagesType, "package", language);
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
    return { categoriesFilter, rangePriceFilter };
  };

  const handleOptions = () => {
    const { categoriesFilter, rangePriceFilter } = optionsFilter();

    setState({ ...state, optionsCategory: categoriesFilter, optionsPrice: rangePriceFilter });

    pageClinicDoctors
      ? onFilteredData(dataFiltered.length > 0 ? dataFiltered : doctorsById)
      : onFilteredData(dataFiltered.length > 0 ? dataFiltered : packageArr);
    return;
  };

  const handleDisplayOptions = (optionsOf) => {
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

  //SEARCH
  const handleOnChangeSearch = (e) => {
    return setState({ ...state, inputSearch: e.target.value });
  };

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    handleFilter();
  };

  const filterBySearch = (inputSearch) => {
    const isOptionAllSelected =
      state.categorySelected.includes("All") ||
      state.categorySelected.includes("Tất cả") ||
      !state.categorySelected.length;

    const compare = (arr) => {
      return arr.filter((data) => {
        const targetCompare = pageClinicDoctors ? helperDisplayNameDoctor(data) : data.nameVi;
        const { targetName, input } = helperFilterSearch(inputSearch, targetCompare);
        return targetName.includes(input);
      });
    };

    let newPackagesFiltered;
    if (pageClinicDoctors) {
      newPackagesFiltered = compare(doctorsById);
    } else {
      newPackagesFiltered = compare(packageArr);
    }

    if (!isOptionAllSelected && state.categorySelected.length) {
      newPackagesFiltered = helperFilterCategory(newPackagesFiltered);
      return newPackagesFiltered;
    }

    if (inputSearch) {
      return newPackagesFiltered;
    }
    return pageClinicDoctors ? doctorsById : packageArr;
  };

  //FILTER BY CATEGORY
  const handleSelectedCategory = (category) => {
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

  const helperFilterCategory = (arr) => {
    const propBaseLanguage = language === "vi" ? "nameVi" : "nameEn";
    return arr.filter((data) => {
      let category;
      if (pageClinicDoctors) {
        const { specialtyData } = data;
        category = specialtyData[propBaseLanguage];
      } else {
        category = data.packageType[propBaseLanguage];
      }
      return state.categorySelected.includes(category);
    });
  };

  const filterByCategory = () => {
    const arrBaseLanguage = pageClinicDoctors ? doctorsById : packageArr;
    const isOptionAllSelected =
      state.categorySelected.includes("All") ||
      state.categorySelected.includes("Tất cả") ||
      !state.categorySelected.length;

    if (state.inputSearch) {
      const packagesSearched = filterBySearch(state.inputSearch);
      return packagesSearched;
    }

    if (isOptionAllSelected) {
      return arrBaseLanguage;
    }

    const newPackagesFiltered = helperFilterCategory(arrBaseLanguage);
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

  const handleFilter = () => {
    let newPackagesFiltered;

    if (state.inputSearch) {
      newPackagesFiltered = filterBySearch(state.inputSearch);
    }

    if (state.categorySelected.length) {
      newPackagesFiltered = filterByCategory();
    }

    if (state.priceSelected) {
      newPackagesFiltered = filterByPrice(
        newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr)
      );
    }

    setState({ ...state, isOpenCategory: false, isOpenPrice: false });
    onFilteredData(newPackagesFiltered || (pageClinicDoctors ? doctorsById : packageArr));
    return;
  };

  const handleRefresh = (refreshOf) => {
    const arrBaseLanguage = pageClinicDoctors ? doctorsById : packageArr;
    if (!refreshOf) {
      setState({
        ...state,
        priceSelected: "",
        priceTo: "",
        priceFrom: "",
        isOpenPrice: false,

        categorySelected: [],
        isOpenCategory: false,

        inputSearch: "",
      });
      onFilteredData(arrBaseLanguage);
      return;
    }

    let newPackagesFiltered;
    if (state.inputSearch) {
      newPackagesFiltered = filterBySearch(state.inputSearch);
    }

    if (refreshOf === "Category") {
      if (state.priceSelected) {
        newPackagesFiltered = filterByPrice(newPackagesFiltered || arrBaseLanguage);
      }

      setState({ ...state, isOpenCategory: false, isOpenPrice: false, categorySelected: [] });
      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBaseLanguage);
      return;
    }

    if (refreshOf === "Price") {
      if (state.categorySelected) {
        newPackagesFiltered = filterByCategory(newPackagesFiltered || arrBaseLanguage);
      }

      setState({
        ...state,
        isOpenCategory: false,
        isOpenPrice: false,
        priceSelected: "",
        priceTo: "",
        priceFrom: "",
      });

      onFilteredData(newPackagesFiltered?.length ? newPackagesFiltered : arrBaseLanguage);

      return;
    }
  };

  const handleStateChangeLanguage = () => {
    const { categorySelected, priceSelected } = state;
    const { categoriesFilter, rangePriceFilter } = optionsFilter();

    const languageKey = language === "vi" ? "nameVi" : "nameEn";
    const arrBaseLanguage = pageClinicDoctors ? doctorsById : packageArr;

    // CATEGORY
    const changeCategorySelected = (arr) => {
      const selectedCategories = [];
      const languageKeyReverse = language === "vi" ? "nameEn" : "nameVi";
      const propsBaseLanguage = pageClinicDoctors ? "specialtyData" : "packageType";

      for (const data of arr) {
        const condition = data[propsBaseLanguage][languageKeyReverse];
        const checkOldSelectedCategory = categorySelected.includes(condition);

        if (checkOldSelectedCategory) {
          selectedCategories.push(data[propsBaseLanguage][languageKey]);
        }
      }

      return selectedCategories;
    };

    const isOptionAllSelected = categorySelected.includes("All") || categorySelected.includes("Tất cả");
    const newCategorySelected = isOptionAllSelected
      ? [language === "vi" ? "Tất cả" : "All"]
      : [...new Set(changeCategorySelected(arrBaseLanguage))];

    // PRICE
    const indexPriceSelected = state.optionsPrice.findIndex((price) => price === priceSelected);
    const newPriceSelected =
      indexPriceSelected !== -1 ? rangePriceFilter[indexPriceSelected] : state.priceSelected;
    const splitPrice = newPriceSelected?.split(" ");

    if (!splitPrice) {
      return setState({
        ...state,
        optionsCategory: categoriesFilter,
        categorySelected: newCategorySelected,
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
        categorySelected: newCategorySelected,
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
        categorySelected: newCategorySelected,
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
      categorySelected: newCategorySelected,
      priceSelected: formatSelectedPrice,
      priceFrom: pricePassToState(pricesArr[0]),
      priceTo: pricePassToState(pricesArr[1]),
      optionsCategory: categoriesFilter,
      optionsPrice: rangePriceFilter,
    });
  };

  useEffect(() => {
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
    handleStateChangeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="filters u-wrapper">
      <div className="filter-search">
        <InputSearch
          placeholder={language === "vi" ? "Tìm kiếm gói khám bệnh" : "Search for packages examination"}
          icon={<GoSearch />}
          onSearch={handleOnChangeSearch}
          onClickSearch={() => handleFilter()}
          onEnterKey={handlePressEnter}
          value={state.inputSearch}
        />
      </div>

      <div className="filter">
        <div className="filter-item filter-item--category" onClick={() => handleDisplayOptions("Category")}>
          <div className="filter-item__name">
            {state.categorySelected?.join(", ") || t("clinic-carousel-more.category")}
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
            {!state.priceFrom && !state.priceTo ? t("clinic-carousel-more.price") : state.priceSelected}
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

        <button className="refresh" onClick={() => handleRefresh()}>
          <SlRefresh />
        </button>
      </div>
    </div>
  );
};

export default Filter;

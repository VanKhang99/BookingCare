import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { SlRefresh } from "react-icons/sl";
import { TbFilter } from "react-icons/tb";
import { TO_USD } from "../../utils/constants";
import { formatterPrice } from "../../utils/helpers";

const initialState = {
  isOpenPrice: false,
  optionsPrice: [],

  priceFrom: "",
  priceTo: "",
};

export const FilterPrice = ({ priceSelected, onRefresh, onFilter, onSetSelectedOption, onRefreshAll }) => {
  const [priceState, setPriceState] = useState(initialState);
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(`${language === "vi" ? "vi-VN" : "en-US"}`, {
        style: "currency",
        currency: `${language === "vi" ? "VND" : "USD"}`,
      }),
    [language]
  );
  console.log(typeof onRefreshAll);

  const optionsFilter = () => {
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

    return rangePriceFilter;
  };

  const handleOptionsPrice = () => {
    const rangePriceFilter = optionsFilter();

    setPriceState({
      ...priceState,
      optionsPrice: rangePriceFilter,
    });
  };

  const handleDisplayOptionsPrice = () => {
    setPriceState({ ...priceState, isOpenPrice: true });
  };

  const handleGetPrices = (arr) => {
    return arr
      .filter((price) => price.includes("₫") || price.includes("$"))
      .map((part) => parseInt(part.replace(/[^\d]/g, ""), 10));
  };

  const handleSelectedPrice = (price) => {
    if (priceSelected === price) {
      setPriceState({
        ...priceState,
        priceFrom: "",
        priceTo: "",
      });

      onSetSelectedOption("price", "");
      return;
    }

    const splitPrice = price.split(" ");
    const pricesArr = handleGetPrices(splitPrice);
    if (pricesArr.length <= 1) {
      if (splitPrice.includes("Dưới") || splitPrice.includes("Under")) {
        setPriceState({
          ...priceState,
          priceTo: pricesArr[0],
          priceFrom: "",
          priceSelected: price,
        });
        onSetSelectedOption("price", price);
        return;
      } else if (splitPrice.includes("Trên") || splitPrice.includes("Over")) {
        setPriceState({
          ...priceState,
          priceFrom: pricesArr[0],
          priceTo: "",
        });
        onSetSelectedOption("price", price);
        return;
      }
    }

    setPriceState({
      ...priceState,
      priceFrom: pricesArr[0],
      priceTo: pricesArr[1],
    });
    onSetSelectedOption("price", price);
    return;
  };

  const handleOnChangePriceInput = (e, typePrice) => {
    e.preventDefault();
    const { value } = e.target;
    const { priceTo, priceFrom } = priceState;

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

    setPriceState({
      ...priceState,
      [typePrice]: value,
    });
    onSetSelectedOption("price", formatPriceSelectedToShow);
  };

  const preprocessFilterPrice = (arr) => {
    return arr.map(({ price }) => price.split(" - ").map((p) => (language === "vi" ? +p : +p / 25000)));
  };

  const filterByPrice = (arr) => {
    const { priceFrom, priceTo } = priceState;
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

      // console.log(price);
      // if (price.length > 1) {
      //   return price.every((p) => (+p >= +priceFrom || +p / +priceFrom >= 0.98) && +p <= +priceTo);
      // }

      return price.every((p) => +p >= +priceFrom && +p <= +priceTo);
    });
    return newPackagesFiltered;
  };

  const handleRefreshAll = () => {
    onRefreshAll();
    setPriceState({ ...priceState, isOpenCategory: false });
  };

  const handleRefreshPrice = () => {
    setPriceState({ ...priceState, isOpenPrice: false, priceTo: "", priceFrom: "" });
    onSetSelectedOption("price", "");
    onRefresh("Price");
  };

  const handleFilterPrice = () => {
    setPriceState({ ...priceState, isOpenPrice: false });
    onFilter({ filterByPrice: filterByPrice });
  };

  const handleStateChangeLanguage = () => {
    const { priceFrom, priceTo } = priceState;
    const rangePriceFilter = optionsFilter();

    if (!priceFrom && !priceTo) {
      setPriceState({
        ...priceState,
        priceFrom: "",
        priceTo: "",
        optionsPrice: rangePriceFilter,
      });
      onSetSelectedOption("price", "");
      return;
    }

    const indexPriceSelected = priceState.optionsPrice.findIndex((price) => price === priceSelected);
    const newPriceSelected = indexPriceSelected !== -1 ? rangePriceFilter[indexPriceSelected] : priceSelected;
    const splitPrice = newPriceSelected?.split(" ");

    if (!splitPrice) {
      return setPriceState({
        ...priceState,
        optionsPrice: rangePriceFilter,
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

      setPriceState({
        ...priceState,
        priceFrom: "",
        priceTo: pricePassToState(pricesArr[0]),
        optionsPrice: rangePriceFilter,
      });
      onSetSelectedOption("price", formatSelectedPrice);
      return;
    }

    if (splitPrice.includes("Trên") || splitPrice.includes("Over")) {
      formatSelectedPrice =
        indexPriceSelected !== -1 ? newPriceSelected : `${wordOver} ${priceBaseLanguage(pricesArr[0])}`;

      setPriceState({
        ...priceState,
        priceFrom: pricePassToState(pricesArr[0]),
        priceTo: "",
        optionsPrice: rangePriceFilter,
      });
      onSetSelectedOption("price", formatSelectedPrice);
      return;
    }

    formatSelectedPrice =
      indexPriceSelected !== -1
        ? newPriceSelected
        : `${wordFrom} ${priceBaseLanguage(pricesArr[0])} ${wordTo} ${priceBaseLanguage(pricesArr[1])}`;

    setPriceState({
      ...priceState,
      priceFrom: pricePassToState(pricesArr[0]),
      priceTo: pricePassToState(pricesArr[1]),
      optionsPrice: rangePriceFilter,
    });
    onSetSelectedOption("price", formatSelectedPrice);
    return;
  };

  useEffect(() => {
    handleOptionsPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleStateChangeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="filter-item filter-item--price" onClick={handleDisplayOptionsPrice}>
      <span className="filter-item__name">
        {!priceState.priceFrom && !priceState.priceTo ? t("clinic-carousel-more.price") : priceSelected}
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
        className={`${priceState.isOpenPrice ? "filter-select open" : "filter-select"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-select__title">
          <span>{t("clinic-carousel-more.find-by-range")}</span>
          <IoClose onClick={() => setPriceState({ ...priceState, isOpenPrice: false })} />
        </div>

        <div className="filter-select__inputs">
          <input
            type="number"
            placeholder={language === "vi" ? "Từ" : "From"}
            value={priceState.priceFrom}
            onChange={(e) => handleOnChangePriceInput(e, "priceFrom")}
          />
          <span> - </span>
          <input
            type="number"
            placeholder={language === "vi" ? "Đến" : "To"}
            value={priceState.priceTo}
            onChange={(e) => handleOnChangePriceInput(e, "priceTo")}
          />
        </div>
        <strong className="filter-select__title">{t("clinic-carousel-more.or-choose-price")}</strong>
        <div className="filter-options">
          {priceState.optionsPrice.length > 0 &&
            priceState.optionsPrice.map((price, index) => {
              return (
                <span
                  key={index}
                  className={
                    priceSelected === price
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
          <button className="filter-buttons__refresh" onClick={handleRefreshPrice}>
            <SlRefresh />
          </button>

          <button className="filter-buttons__filter" onClick={handleFilterPrice}>
            <TbFilter />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPrice;

{
  /* <FilterPrice
          priceSelected={state.priceSelected}
          onRefresh={handleRefresh}
          onFilter={handleFilter}
          onSetSelectedOption={handleSetSelectedOptions}
          onRefreshAll={handleRefreshAll}
        /> */
}

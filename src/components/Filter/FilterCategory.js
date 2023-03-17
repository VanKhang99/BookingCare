import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllPackagesType } from "../../slices/packageTypeSlice";
import { helperFilterSearch, helperDisplayNameDoctor, helperCreateCategory } from "../../utils/helpers";
import { IoClose } from "react-icons/io5";
import { SlRefresh } from "react-icons/sl";
import { TbFilter } from "react-icons/tb";

const initialState = {
  optionsCategory: [],
  isOpenCategory: false,
};

const FilterCategory = ({
  pageClinicDoctors,
  doctorsById,
  packageArr,
  categorySelected,
  onSetSelectedOption,
  onFilter,
  onRefresh,
  onRefreshAll,
  filterBySearch,
  inputSearch,
}) => {
  const [categoryState, setCategoryState] = useState(initialState);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { packagesType } = useSelector((store) => store.packageType);

  const optionsFilter = () => {
    console.log("test");
    let categoriesFilter;
    if (pageClinicDoctors) {
      categoriesFilter = helperCreateCategory(doctorsById, "doctor", language);
    } else {
      categoriesFilter = helperCreateCategory(packagesType, "package", language);
    }
    return categoriesFilter;
  };

  const handleOptionsCategory = () => {
    const categoriesFilter = optionsFilter();
    console.log(categoriesFilter);

    return setCategoryState({
      ...categoryState,
      optionsCategory: categoriesFilter,
    });
  };

  const handleDisplayOptionsCategory = () => {
    setCategoryState({ ...categoryState, isOpenCategory: true });
  };

  const handleSelectedCategory = (category) => {
    const isCategorySelected = categorySelected.includes(category);

    if (isCategorySelected) {
      const resetCategorySelected = categorySelected.filter((cate) => cate !== category);
      return onSetSelectedOption("category", resetCategorySelected);
    }

    if (category === "Tất cả" || category === "All") {
      return onSetSelectedOption("category", [category]);
    }

    const filterCategoryAll = [...categorySelected, category].filter(
      (cate) => cate !== (language === "vi" ? "Tất cả" : "All")
    );
    return onSetSelectedOption("category", [...new Set(filterCategoryAll)]);
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
      return categorySelected.includes(category);
    });
  };

  const filterByCategory = () => {
    const arrBaseLanguage = pageClinicDoctors ? doctorsById : packageArr;
    const isOptionAllSelected =
      categorySelected.includes("All") || categorySelected.includes("Tất cả") || !categorySelected.length;

    if (inputSearch) {
      const packagesSearched = filterBySearch(inputSearch);
      return packagesSearched;
    }

    if (isOptionAllSelected) {
      return arrBaseLanguage;
    }

    const newPackagesFiltered = helperFilterCategory(arrBaseLanguage);
    return newPackagesFiltered;
  };

  const handleFilterCategory = () => {
    setCategoryState({ ...categoryState, isOpenCategory: false });
    onFilter({ filterByCategory: filterByCategory });
  };

  const handleRefreshAll = () => {
    onRefreshAll();
    setCategoryState({ ...categoryState, isOpenCategory: false });
  };

  const handleRefreshCategory = () => {
    setCategoryState({ ...categoryState, isOpenCategory: false });
    onSetSelectedOption("category", []);
    onRefresh("Category");
  };

  const handleStateChangeLanguage = () => {
    const categoriesFilter = optionsFilter();

    const languageKey = language === "vi" ? "nameVi" : "nameEn";
    const arrBaseLanguage = pageClinicDoctors ? doctorsById : packageArr;

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

    // CATEGORY
    const isOptionAllSelected = categorySelected.includes("All") || categorySelected.includes("Tất cả");
    const newCategorySelected = isOptionAllSelected
      ? [language === "vi" ? "Tất cả" : "All"]
      : [...new Set(changeCategorySelected(arrBaseLanguage))];

    setCategoryState({
      ...categoryState,
      optionsCategory: categoriesFilter,
    });
    onSetSelectedOption("category", newCategorySelected);
    return;
  };

  useEffect(() => {
    dispatch(getAllPackagesType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (packagesType.length > 0) {
      handleOptionsCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesType.length]);

  useEffect(() => {
    handleStateChangeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  console.log(categoryState);

  return (
    <div className="filter-item filter-item--category" onClick={handleDisplayOptionsCategory}>
      <div className="filter-item__name">
        {categorySelected?.join(", ") || t("clinic-carousel-more.category")}
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
        className={`${categoryState.isOpenCategory ? "filter-select open" : "filter-select"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-select__title">
          <span>{t("clinic-carousel-more.choose-category")}</span>
          <IoClose onClick={() => setCategoryState({ ...categoryState, isOpenCategory: false })} />
        </div>

        <div className="filter-options">
          {categoryState.optionsCategory.length > 0 &&
            categoryState.optionsCategory.map((category) => {
              return (
                <span
                  key={category}
                  className={
                    categorySelected.includes(category)
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
          <button className="filter-buttons__refresh" onClick={handleRefreshCategory}>
            <SlRefresh />
          </button>
          <button className="filter-buttons__filter" onClick={handleFilterCategory}>
            <TbFilter />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterCategory;

{
  /* <FilterCategory
          pageClinicDoctors={pageClinicDoctors}
          doctorsById={doctorsById}
          packageArr={packageArr}
          categorySelected={state.categorySelected}
          onSetSelectedOption={handleSetSelectedOptions}
          onRefresh={handleRefresh}
          onFilter={handleFilter}
          onRefreshAll={handleRefreshAll}
          filterBySearch={filterBySearch}
          inputSearch={state.inputSearch}
        /> */
}

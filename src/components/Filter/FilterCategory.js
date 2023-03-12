import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPackagesType } from "../../slices/packageTypeSlice";
import { helperFilterSearch } from "../../utils/helpers";
import { SlRefresh } from "react-icons/sl";
import { TbFilter } from "react-icons/tb";

const FilterCategory = (packageArr, inputSearch, onDisplayOptions, isOpenCategory, onRefresh, onFilter) => {
  const [categorySelected, setCategorySelected] = useState([]);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { packagesType } = useSelector((store) => store.packageType);

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
    return categoriesFilter;
  };

  const handleSelectedCategory = (category) => {
    if (!category) {
      const isOptionAllSelected = categorySelected.includes("All") || categorySelected.includes("Tất cả");

      const categorySelectedChangeLanguage = packageArr.reduce((acc, pk) => {
        const checkOldSelectedCategory = categorySelected.includes(
          pk.packageType[language === "vi" ? "nameEn" : "nameVi"]
        );

        if (checkOldSelectedCategory) {
          acc.push(pk.packageType[language === "vi" ? "nameVi" : "nameEn"]);
        }
        return acc;
      }, []);

      setCategorySelected(
        isOptionAllSelected
          ? [language === "vi" ? "Tất cả" : "All"]
          : [...new Set(categorySelectedChangeLanguage)]
      );
      setOptionsCategory(optionsFilter());
      return;
    }

    const isCategorySelected = categorySelected.includes(category);

    if (isCategorySelected) {
      const resetCategorySelected = categorySelected.filter((cate) => cate !== category);
      setCategorySelected(resetCategorySelected);
      // setState({
      //   ...state,
      //   categorySelected: resetCategorySelected,
      // });
      return;
    }

    if (category === "Tất cả" || category === "All") {
      setCategorySelected([category]);
      // setState({ ...state, categorySelected: [category] });
      return;
    }

    const filterCategoryAll = [...categorySelected, category].filter(
      (cate) => cate !== (language === "vi" ? "Tất cả" : "All")
    );
    setCategorySelected([...new Set(filterCategoryAll)]);
    return;
    // return setState({ ...state, categorySelected: [...new Set(filterCategoryAll)] });
  };

  const handleRefresh = () => {
    const newPackagesFiltered = packageArr.filter((pk) => {
      const { targetName, input } = helperFilterSearch(inputSearch, pk.nameVi);
      return targetName.includes(input);
    });

    setCategorySelected([]);
    onRefresh("Category", { newPackagesFiltered });
  };

  const handleFilter = () => {
    const isOptionAllSelected =
      categorySelected.includes("All") || categorySelected.includes("Tất cả") || !categorySelected.length;

    const newPackagesFiltered = isOptionAllSelected
      ? packageArr
      : packageArr.filter((pk) => {
          const typePk = pk.packageType[language === "vi" ? "nameVi" : "nameEn"];
          return categorySelected.includes(typePk);
        });
    onFilter("Category", { newPackagesFiltered });
  };

  useEffect(() => {
    dispatch(getAllPackagesType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="filter-item filter-item--category" onClick={onDisplayOptions}>
      <span className="filter-item__name">{categorySelected.join(", ") || "Danh mục"}</span>
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
        className={`${isOpenCategory ? "filter-select open" : "filter-select"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <strong className="filter-select__title">Lựa chọn danh mục</strong>

        <div className="filter-options">
          {optionsCategory.length > 0 &&
            optionsCategory.map((category) => {
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
          <button className="filter-button" onClick={() => handleRefresh("Category")}>
            <SlRefresh />
          </button>

          <button className="filter-button" onClick={() => handleFilter("Category")}>
            <TbFilter />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterCategory;

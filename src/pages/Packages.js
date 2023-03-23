import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Filter, PackageBanner } from "../components";
import { getAllPackages } from "../slices/packageSlice";
import { getAllCategories } from "../slices/categorySlice";
import { getAllClinics } from "../slices/clinicSlice";
import { formatterPrice } from "../utils/helpers";
import { path } from "../utils/constants";
import "../styles/Packages.scss";

const initialState = {
  isLimitPackagesOutstanding: true,
  isLimitCategories: true,
  packages: [],
  packagesOutstanding: [],
  categories: [],
  clinicsHavePackages: [],

  willNavigateToNewComponent: false,
};

const Packages = () => {
  const [packageState, setPackageState] = useState(initialState);
  const [dataFiltered, setDataFiltered] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { categories } = useSelector((store) => store.category);

  const handlePackagesClinics = async () => {
    try {
      const res = await Promise.all([
        dispatch(getAllPackages({ clinicId: null, specialId: null, getAll: false })),
        dispatch(getAllClinics("all")),
      ]);

      const packages = res[0]?.payload?.data;
      const packagesOutstanding = packages.filter((pk) => pk.popular);

      const clinicsIdInPackages = [...new Set(packages.map((pk) => pk.clinicId))];
      const clinics = res[1]?.payload?.clinics;
      const clinicsHavePackages = clinics.filter((clinic) => clinicsIdInPackages.includes(clinic.id));

      setPackageState({ ...packageState, packages, packagesOutstanding, clinicsHavePackages });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilteredData = (arr) => {
    setDataFiltered(arr);
  };

  const handleArrayToRender = (type) => {
    const arrayOriginal = type.startsWith("Packages")
      ? packageState.packages.filter((pk) => pk.popular)
      : categories;
    const arrayToShow = type.startsWith("Packages") ? arrayOriginal.slice(0, 8) : arrayOriginal.slice(0, 6);

    if (!arrayOriginal.length) return [];
    if (packageState[`isLimit${type}`]) {
      return arrayToShow;
    }

    return arrayOriginal;
  };

  const handleLimitData = (type) => {
    const arrayOriginal = type.startsWith("Packages")
      ? packageState.packages.filter((pk) => pk.popular)
      : categories;
    const arrayToShow = type.startsWith("Packages") ? arrayOriginal.slice(0, 8) : arrayOriginal.slice(0, 6);
    const propsToSet = type.startsWith("Packages") ? "packagesOutstanding" : "categories";

    if (packageState[`isLimit${type}`]) {
      return setPackageState({
        ...packageState,
        [`isLimit${type}`]: false,
        [propsToSet]: arrayToShow,
      });
    }

    return setPackageState({
      ...packageState,
      [`isLimit${type}`]: true,
      [propsToSet]: arrayOriginal,
    });
  };

  useEffect(() => {
    dispatch(getAllCategories());
    handlePackagesClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="packages">
      <PackageBanner
        packageArr={packageState.packages}
        dataFiltered={dataFiltered}
        onFilteredData={handleFilteredData}
      />

      <div className="u-wrapper">
        <div className="packages-categories">
          <div className="packages-categories-top">
            <h2 className="packages-categories-top__title">Danh mục</h2>

            <button className="button button-main" onClick={() => handleLimitData("Categories")}>
              {packageState.isLimitCategories ? t("button.see-more") : t("button.hide-away")}
            </button>
          </div>

          <div className="packages-categories-list">
            {handleArrayToRender("Categories").map((pk) => {
              const { id, imageUrl, nameEn, nameVi } = pk;

              return (
                <Link to={`${path.CATEGORIES}/${id}`} key={id} className="packages-categories-item">
                  <img
                    src={imageUrl}
                    alt={language === "vi" ? nameVi : nameEn}
                    className="packages-categories-item__image"
                  />
                  <div className="packages-categories-item__name">
                    <span>{language === "vi" ? nameVi : nameEn}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="packages-outstanding">
          <div className="packages-outstanding-top">
            <h2 className="packages-outstanding-top__title">Gói khám nổi bật</h2>

            <button className="button button-main" onClick={() => handleLimitData("PackagesOutstanding")}>
              {packageState.isLimitPackagesOutstanding ? t("button.see-more") : t("button.hide-away")}
            </button>
          </div>

          <div className="packages-outstanding-list">
            {handleArrayToRender("PackagesOutstanding").map((pk) => {
              const { id, imageUrl, nameEn, nameVi, price } = pk;

              return (
                <Link to={`${id}`} key={id} className="packages-outstanding-item">
                  <img
                    src={imageUrl}
                    alt={language === "vi" ? nameVi : nameEn}
                    className="packages-outstanding-item__image"
                  />
                  <div className="packages-outstanding-item__name">
                    <span>{language === "vi" ? nameVi : nameEn}</span>
                  </div>

                  <div className="packages-outstanding-price">
                    <span>Giá</span>
                    <b>{formatterPrice(language, price)}</b>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="packages-clinics">
          <div className="packages-clinics-top">
            <h2 className="packages-clinics-top__title">Cơ sở y tế</h2>

            <Link
              to={`${path.CLINIC}s`}
              state={{ clinicsHavePackages: packageState.clinicsHavePackages }}
              className="button button-main"
            >
              {t("button.see-more")}
            </Link>
          </div>

          <div className="packages-clinics-list">
            {packageState.clinicsHavePackages.length > 0 &&
              packageState.clinicsHavePackages.slice(0, 5).map((pk) => {
                const { id, logoUrl, nameEn, nameVi } = pk;

                return (
                  <Link to={`/`} key={id} className="packages-clinics-item">
                    <img
                      src={logoUrl}
                      alt={language === "vi" ? nameVi : nameEn}
                      className="packages-clinics-item__image"
                    />
                    <div className="packages-clinics-item__name">
                      <span>{language === "vi" ? nameVi : nameEn}</span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;

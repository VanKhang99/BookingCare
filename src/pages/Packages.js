import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import { Filter, Package, ModalBooking, ScrollToTop } from "../components";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getAllCategories } from "../slices/categorySlice";
import { getAllClinics } from "../slices/clinicSlice";
import { formatterPrice, dataModalBooking } from "../utils/helpers";
import { path, START_INDEX, END_INDEX } from "../utils/constants";
import "../styles/Packages.scss";

const initialState = {
  isLimitPackagesOutstanding: true,
  isLimitCategories: true,
  packagesOutstanding: [],
  clinicsHavePackages: [],
  packages: [],
  packageFilteredInit: [],

  hideSomeElement: false,

  isOpenModalBooking: false,
  hourBooked: "",
  packageId: "",
  packageData: {},

  startIndex: START_INDEX,
  endIndex: END_INDEX,
  isRenderFull: false,
};

const Packages = () => {
  const [packageState, setPackageState] = useState(initialState);
  const [packageToRender, setPackageToRender] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { isLoadingCategory, categories } = useSelector((store) => store.category);
  const { isLoadingPackage, packageArr } = useSelector((store) => store.package);
  const { isLoadingClinics, clinics } = useSelector((store) => store.clinic);

  const handleModal = async (hourClicked, doctorId = null, packageId = null) => {
    // console.log("test");
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking
    try {
      if (packageId) {
        const res = await dispatch(getPackage(+packageId));

        if (res?.payload?.data) {
          return setPackageState({
            ...packageState,
            packageData: res.payload.data,
            packageId,

            isOpenModalBooking: !packageState.isOpenModalBooking,
            hourClicked: { ...hourClicked },
          });
        }
      }

      return setPackageState({
        ...packageState,
        isOpenModalBooking: !packageState.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePackagesClinics = () => {
    const packagesOutstanding = packageArr.filter((pk) => pk.popular);
    const clinicsIdInPackages = [...new Set(packageArr.map((pk) => pk.clinicId))];
    const clinicsHavePackages = clinics.filter((clinic) => clinicsIdInPackages.includes(clinic.id));

    setPackageState({
      ...packageState,
      packages: packageArr,
      packagesOutstanding,
      clinicsHavePackages,
      packageFilteredInit: packageArr,
    });
  };

  const handleFilteredData = (arr, firstFilter = false) => {
    if (firstFilter) {
      return setPackageToRender(arr);
    }

    setPackageState({
      ...packageState,
      packageFilteredInit: arr,
      hideSomeElement: true,
      startIndex: START_INDEX,
      endIndex: END_INDEX,
      isRenderFull: false,
    });
    setPackageToRender(arr.slice(START_INDEX, END_INDEX));
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

  const handleHideElement = () => {
    setPackageState({ ...packageState, hideSomeElement: true });
  };

  const backToInitialInterface = () => {
    setPackageState({
      ...packageState,
      hideSomeElement: false,
      packageFilteredInit: [],

      isOpenModalBooking: false,
      hourBooked: "",
      packageId: "",
      packageData: {},

      isLimitPackagesOutstanding: true,
      isLimitCategories: true,
    });
  };

  const handleScroll = () => {
    // if()
    if (packageState.isRenderFull) return;
    if (!packageState.packageFilteredInit.length) return;
    if (
      window.innerHeight + document.documentElement.scrollTop <=
      document.documentElement.offsetHeight - 2
    ) {
      return;
    }
    if (packageState.startIndex > packageState.packageFilteredInit.length)
      return setPackageState({ ...packageState, isRenderFull: true });

    const newStartIndex = packageState.startIndex + 5;
    const newEndIndex = packageState.endIndex + 5;
    const newPackageFiltered = packageState.packageFilteredInit.slice(newStartIndex, newEndIndex);
    setPackageState({ ...packageState, startIndex: newStartIndex, endIndex: newEndIndex });
    setPackageToRender([...packageToRender, ...newPackageFiltered]);
  };

  useEffect(() => {
    if (!categories.length) {
      dispatch(getAllCategories());
    }

    if (!packageArr.length || !clinics.length) {
      Promise.all([dispatch(getAllPackages()), dispatch(getAllClinics())]);
    }

    if (packageArr.length && clinics.length) {
      handlePackagesClinics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length, packageArr.length, clinics.length]);

  useEffect(() => {
    document.title = language === "vi" ? "Gói khám bệnh" : "Medical examination packages";
  }, [language]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageState.startIndex, packageState.endIndex, packageState.packageFilteredInit.length]);

  return (
    <div className="packages-container">
      <div className="packages-head">
        <div className="packages-head-image">
          <h2 className="packages-head-image__title">{t("packages.medical-package").toUpperCase()}</h2>
        </div>

        <div className="packages-filter">
          <Filter
            packageArr={packageState.packages}
            dataFiltered={packageToRender}
            onFilteredData={handleFilteredData}
            haveFilterByClinicsAndCity={true}
            onHideSomeElement={handleHideElement}
            onBackInitialInterface={backToInitialInterface}
          />
        </div>
      </div>

      <div className={packageState.hideSomeElement ? "u-wrapper packages-list" : "u-wrapper"}>
        {!packageState.hideSomeElement && (
          <>
            <div className="packages-categories">
              <div className="packages-categories-top">
                <h2 className="packages-categories-top__title">{t("packages.category")}</h2>

                <button className="button button-main" onClick={() => handleLimitData("Categories")}>
                  {packageState.isLimitCategories ? t("button.see-more") : t("button.hide-away")}
                </button>
              </div>

              {!isLoadingCategory ? (
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
              ) : (
                <Skeleton active />
              )}
            </div>

            <div className="packages-outstanding">
              <div className="packages-outstanding-top">
                <h2 className="packages-outstanding-top__title">{t("packages.outstanding-package")}</h2>

                <button className="button button-main" onClick={() => handleLimitData("PackagesOutstanding")}>
                  {packageState.isLimitPackagesOutstanding ? t("button.see-more") : t("button.hide-away")}
                </button>
              </div>

              {!isLoadingPackage ? (
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
              ) : (
                <Skeleton active />
              )}
            </div>

            <div className="packages-clinics">
              <div className="packages-clinics-top">
                <h2 className="packages-clinics-top__title">{t("packages.health-facilities")}</h2>

                <Link
                  to={`${path.CLINIC}s`}
                  state={{ clinicsHavePackages: packageState.clinicsHavePackages }}
                  className="button button-main"
                >
                  {t("button.see-more")}
                </Link>
              </div>

              {!isLoadingClinics ? (
                <div className="packages-clinics-list">
                  {packageState.clinicsHavePackages.length > 0 &&
                    packageState.clinicsHavePackages.slice(0, 5).map((pk) => {
                      const { id, logoUrl, nameEn, nameVi } = pk;
                      return (
                        <Link to={`${path.CLINIC}/${id}`} key={id} className="packages-clinics-item">
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
              ) : (
                <Skeleton active />
              )}
            </div>
          </>
        )}

        {packageState.hideSomeElement &&
          packageToRender.length > 0 &&
          packageToRender.map((pk) => {
            return (
              <Package
                key={pk.id}
                packageId={pk.id}
                onToggleModal={handleModal}
                packageData={pk}
                assurance
                needAddress
              />
            );
          })}
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={packageState.isOpenModalBooking}
          onHide={() => handleModal()}
          packageId={packageState.packageId ? packageState.packageId : ""}
          packageData={dataModalBooking(language, packageState.packageData, "package")}
          hourClicked={!_.isEmpty(packageState.hourClicked) && packageState.hourClicked}
        />
      </div>

      {packageState.hideSomeElement && <ScrollToTop />}
    </div>
  );
};

export default Packages;

import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Filter, Package, ModalBooking, ScrollToTop } from "../components";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getCategory } from "../slices/categorySlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { dataModalBooking } from "../utils/helpers";
import { START_INDEX, END_INDEX } from "../utils/constants";
import "../styles/DetailCategory.scss";

const initialState = {
  packageArr: [],
  packageFilteredInit: [],

  isOpenModalBooking: false,
  hourBooked: "",
  packageId: "",
  packageData: {},

  hideSomeElement: false,
  haveFilterByClinicsAndCity: true,

  startIndex: START_INDEX,
  endIndex: END_INDEX,
  isRenderFull: false,
};

const DetailCategory = () => {
  const [categoryState, setCategoryState] = useState(initialState);
  const [packageToRender, setPackageToRender] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { categoryId } = useParams();
  const { packageArr } = useSelector((store) => store.package);
  const { data: category } = useFetchDataBaseId(+categoryId, "category", getCategory);

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
          return setCategoryState({
            ...categoryState,
            packageData: res.payload.data,
            packageId,

            isOpenModalBooking: !categoryState.isOpenModalBooking,
            hourClicked: { ...hourClicked },
          });
        }
      }

      return setCategoryState({
        ...categoryState,
        isOpenModalBooking: !categoryState.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePackages = () => {
    const packagesFilterById = packageArr.filter((pk) => pk.specialtyId === null);
    const packageBelongCategory = packagesFilterById.filter((cate) => cate.categoryId.includes(categoryId));

    setCategoryState({
      ...categoryState,
      packageArr: packagesFilterById,
      packageFilteredInit: packageBelongCategory,
    });
    setPackageToRender(packageBelongCategory.slice(START_INDEX, END_INDEX));
  };

  const handleFilteredData = (arr, firstFilter = false) => {
    if (firstFilter) {
      return setPackageToRender(arr);
    }

    setCategoryState({
      ...categoryState,
      packageFilteredInit: arr,
      hideSomeElement: true,
      startIndex: START_INDEX,
      endIndex: END_INDEX,
      isRenderFull: false,
    });
    setPackageToRender(arr.slice(START_INDEX, END_INDEX));
  };

  const handleScroll = () => {
    if (categoryState.isRenderFull) return;
    if (!categoryState.packageFilteredInit.length) return;

    if (
      window.innerHeight + document.documentElement.scrollTop <=
      document.documentElement.offsetHeight - 2
    ) {
      return;
    }

    if (categoryState.startIndex > categoryState.packageFilteredInit.length)
      return setCategoryState({ ...categoryState, isRenderFull: true });

    const newStartIndex = categoryState.startIndex + 5;
    const newEndIndex = categoryState.endIndex + 5;
    const newPackageFiltered = categoryState.packageFilteredInit.slice(newStartIndex, newEndIndex);

    setCategoryState({ ...categoryState, startIndex: newStartIndex, endIndex: newEndIndex });
    setPackageToRender([...packageToRender, ...newPackageFiltered]);
  };

  useEffect(() => {
    if (packageArr.length) {
      handlePackages();
      return;
    }

    const dispatchedThunk = dispatch(getAllPackages());

    return () => {
      dispatchedThunk.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, packageArr.length]);

  useEffect(() => {
    if (!_.isEmpty(category)) {
      document.title =
        language === "vi" ? `Gói khám bệnh - ${category.nameVi}` : `Medical packages - ${category.nameEn}`;
    }
    // document.title = language === 'vi'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, _.isEmpty(category)]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryState.startIndex, categoryState.endIndex, categoryState.packageFilteredInit.length]);

  return (
    <div className="detail-category">
      {!categoryState.hideSomeElement && (
        <div className="category-intro">
          <div className="category-intro__background"></div>
          <div className="category-content">
            <div className="category-content-left">
              <img src={category?.imageUrl} alt="" className="category-content-left__image" />
            </div>
            <div className="category-content-right">
              <h2 className="category-content-right__title">
                {language === "vi" ? category?.nameVi : category?.nameEn}
              </h2>
              <p>{t("detail-category.paragraph-1")}</p>
              <p>{t("detail-category.paragraph-2")}</p>
              <p>{t("detail-category.paragraph-3")}</p>
            </div>
          </div>
        </div>
      )}

      <div className={categoryState.hideSomeElement ? "category-body margin-top" : "category-body"}>
        <Filter
          categoryId={categoryId}
          packageArr={categoryState.packageArr}
          dataFiltered={packageToRender}
          onFilteredData={handleFilteredData}
          // onHideSomeElement={handleHideElement}
          haveFilterByClinicsAndCity={categoryState.haveFilterByClinicsAndCity}
        />

        <div className="category-packages u-wrapper">
          {packageToRender.length > 0 &&
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
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={categoryState.isOpenModalBooking}
          onHide={() => handleModal()}
          packageId={categoryState.packageId ? categoryState.packageId : ""}
          packageData={dataModalBooking(language, categoryState.packageData, "package")}
          hourClicked={!_.isEmpty(categoryState.hourClicked) && categoryState.hourClicked}
        />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default DetailCategory;

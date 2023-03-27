import React, { useState, useEffect } from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";
import { useParams } from "react-router-dom";
import { Link as LinkScroll, Element } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getClinic } from "../slices/clinicSlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { Filter, Package, ModalBooking, ScrollToTop } from "../components";
import { MdLocationOn } from "react-icons/md";
import { dataModalBooking } from "../utils/helpers";
import { START_INDEX, END_INDEX } from "../utils/constants";
import "../styles/PackageClinic.scss";

const initialState = {
  isOpenFullIntro: false,
  hideSomeElement: false,
  haveFilterByClinicsAndCity: true,

  isOpenModalBooking: false,
  hourBooked: "",
  packageId: "",
  packageData: {},

  packageArr: [],
  packageFilteredInit: [],

  startIndex: START_INDEX,
  endIndex: END_INDEX,
  isRenderFull: false,
};

const PackageClinic = () => {
  const [pkClinicState, setPkClinicState] = useState(initialState);
  const [packageFiltered, setPackageFiltered] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { clinicId } = useParams();
  const clinicData = useFetchDataBaseId(+clinicId, "clinic", getClinic);

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
          return setPkClinicState({
            ...pkClinicState,
            packageData: res.payload.data,
            packageId,

            isOpenModalBooking: !pkClinicState.isOpenModalBooking,
            hourClicked: { ...hourClicked },
          });
        }
      }

      return setPkClinicState({
        ...pkClinicState,
        isOpenModalBooking: !pkClinicState.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPackageByClinic = async () => {
    try {
      const res = await dispatch(getAllPackages({ clinicId: null, specialtyId: null, getAll: false }));
      if (res.payload.data.length > 0) {
        const packageBelongClinicId = res.payload.data.filter((pk) => pk.clinicId === +clinicId);
        setPkClinicState({
          ...pkClinicState,
          packageArr: res.payload.data,
          packageFilteredInit: packageBelongClinicId,
        });
        setPackageFiltered(packageBelongClinicId.slice(START_INDEX, END_INDEX));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowFullIntro = () => {
    setPkClinicState({ ...pkClinicState, isOpenFullIntro: !pkClinicState.isOpenFullIntro });
  };

  const handleFilteredData = (arr, firstFilter = false) => {
    if (firstFilter) {
      return setPackageFiltered(arr);
    }

    setPkClinicState({
      ...pkClinicState,
      packageFilteredInit: arr,
      hideSomeElement: true,
      startIndex: START_INDEX,
      endIndex: END_INDEX,
      isRenderFull: false,
    });
    setPackageFiltered(arr.slice(START_INDEX, END_INDEX));
  };

  const handleScroll = () => {
    if (pkClinicState.isRenderFull) return;

    if (
      window.innerHeight + document.documentElement.scrollTop <=
      document.documentElement.offsetHeight - 2
    ) {
      return;
    }

    if (pkClinicState.startIndex > pkClinicState.packageFilteredInit.length)
      return setPkClinicState({ ...pkClinicState, isRenderFull: true });

    const newStartIndex = pkClinicState.startIndex + 5;
    const newEndIndex = pkClinicState.endIndex + 5;
    const newPackageFiltered = pkClinicState.packageFilteredInit.slice(newStartIndex, newEndIndex);

    setPkClinicState({ ...pkClinicState, startIndex: newStartIndex, endIndex: newEndIndex });
    setPackageFiltered([...packageFiltered, ...newPackageFiltered]);
  };

  useEffect(() => {
    fetchAllPackageByClinic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!_.isEmpty(clinicData)) {
      document.title =
        language === "vi"
          ? `Gói khám bệnh tại ${clinicData.nameVi}`
          : `Medical packages at ${clinicData.nameEn}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, _.isEmpty(clinicData)]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkClinicState.startIndex, pkClinicState.endIndex, pkClinicState.packageFilteredInit.length]);

  return (
    <div className="package-clinic-container">
      {!pkClinicState.hideSomeElement && (
        <div className="package-clinic-image">
          <img src={clinicData.imageUrl} alt={language === "vi" ? clinicData.nameVi : clinicData.nameEn} />
        </div>
      )}

      <div className="u-wrapper">
        {!pkClinicState.hideSomeElement && (
          <div className="clinic-intro">
            <div className="intro-top">
              <div className="top-left">
                <div className="top-left__image">
                  <img
                    src={clinicData.logoUrl}
                    alt={language === "vi" ? clinicData.nameVi : clinicData.nameEn}
                  />
                </div>

                <div className="top-left-info">
                  <h3 className="top-left-info__name">
                    {language === "vi" ? clinicData.nameVi : clinicData.nameEn}
                  </h3>
                  <div className="top-left-info__address">
                    <MdLocationOn />
                    <span>{clinicData.address}</span>
                  </div>
                </div>
              </div>
              <div className="top-right">
                <LinkScroll
                  activeClass="active"
                  className="button"
                  to={language === "vi" ? "Đặt lịch khám" : "Booking"}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-100}
                >
                  {t("button.booking-examination")}
                </LinkScroll>
              </div>
            </div>

            <div className={pkClinicState.isOpenFullIntro ? "intro-content show" : "intro-content"}>
              {clinicData.introductionHTML && HtmlReactParser(clinicData.introductionHTML)}
            </div>

            <button className="clinic-intro__toggle" onClick={handleShowFullIntro}>
              {pkClinicState.isOpenFullIntro ? t("button.hide-away") : t("button.see-more")}
            </button>
          </div>
        )}

        <div
          className={
            pkClinicState.hideSomeElement
              ? "package-clinic-filter package-clinic-filter--margin-top"
              : "package-clinic-filter"
          }
        >
          <Filter
            clinicId={clinicId}
            packageArr={pkClinicState.packageArr}
            dataFiltered={packageFiltered}
            onFilteredData={handleFilteredData}
            // onHideSomeElement={handleHideElement}
            haveFilterByClinicsAndCity={pkClinicState.haveFilterByClinicsAndCity}
          />
        </div>

        <Element name={language === "vi" ? "Đặt lịch khám" : "Booking"}>
          <div className="package-clinic-list">
            {packageFiltered.length > 0 &&
              packageFiltered.map((pk) => {
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
        </Element>
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={pkClinicState.isOpenModalBooking}
          onHide={() => handleModal()}
          packageId={pkClinicState.packageId ? pkClinicState.packageId : ""}
          packageData={dataModalBooking(language, pkClinicState.packageData, "package")}
          hourClicked={!_.isEmpty(pkClinicState.hourClicked) && pkClinicState.hourClicked}
        />
      </div>

      <ScrollToTop />
    </div>
  );
};

export default PackageClinic;

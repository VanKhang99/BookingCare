import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ClinicTop, InputSearch, Doctor, Package, ModalBooking } from "../components";
import { getClinic } from "../slices/clinicSlice";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getAllDoctorsById, getDoctor } from "../slices/doctorSlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { dataModalBooking } from "../utils/helpers";
import { GoSearch } from "react-icons/go";
import { SlRefresh } from "react-icons/sl";
import { BsCaretDown } from "react-icons/bs";
// import { RxChevronDown } from "react-icons/rx";
import "../styles/ClinicCarouselMore.scss";

const initialState = {
  inputSearch: "",
  isOpenModalBooking: false,
  hourBooked: "",

  doctorId: "",
  doctorData: {},
  packageId: "",
  packageData: {},

  filterDoctors: [],
  filterPackages: [],
  action: "init",
};

const ClinicCarouselMore = ({ pageClinicDoctors, packageClinicSpecialty }) => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);
  const { doctorsById } = useSelector((store) => store.doctor);
  const { packageArr } = useSelector((store) => store.package);
  const dataClinic = useFetchDataBaseId(clinicId ? +clinicId : "", "clinic", getClinic);

  const handleOnChangeSearch = (e) => {
    return setState({ ...state, inputSearch: e.target.value });
  };

  const handleSearchClinics = (inputToActions, type) => {};

  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;

    handleSearchClinics(state.inputSearch, "search");
  };

  const handleModal = async (hourClicked, doctorId = null, packageId = null) => {
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking

    try {
      let res;
      if (pageClinicDoctors) {
        res = await dispatch(getDoctor(+doctorId));
      } else {
        res = await dispatch(getPackage(+packageId));
      }

      if (res?.payload?.data) {
        return setState({
          ...state,
          ...(pageClinicDoctors
            ? { doctorData: res.payload.data, doctorId }
            : { packageData: res.payload.data, packageId }),

          isOpenModalBooking: !state.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });
      }

      return setState({
        ...state,
        isOpenModalBooking: !state.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionFilter = () => {
    if (!doctorsById.length && !packageArr.length) return;

    console.log(packageArr);
  };

  useEffect(() => {
    if (pageClinicDoctors) {
      dispatch(
        getAllDoctorsById({ nameColumnMap: "clinicId", id: +clinicId, typeRemote: "includeTrueAndFalse" })
      );
    } else {
      dispatch(getAllPackages({ clinicId: +clinicId, specialId: null }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleOptionFilter();
  }, [doctorsById.length, packageArr.length]);

  return (
    <div className="clinic-carousel-container">
      {!_.isEmpty(dataClinic) && (
        <>
          <ClinicTop clinicId={+clinicId} dataClinic={dataClinic} />

          <div style={{ borderTop: "1px solid #eee" }}></div>

          <div className="filter u-wrapper">
            <div className="filter-search">
              <InputSearch
                placeholder={language === "vi" ? "Tìm kiếm cơ sở y tế" : "Search for medical facilities"}
                icon={<GoSearch />}
                onSearch={handleOnChangeSearch}
                onClickSearch={() => handleSearchClinics(state.inputSearch, "search")}
                onEnterKey={handlePressEnter}
              />
            </div>

            <div className="filter-select">
              <div className="filter-select-item">
                <span className="filter-select-item__category">Danh mục</span>
                <span className="filter-select-item__icon">
                  <svg
                    stroke="%23000000"
                    fill="%23000000"
                    stroke-width="0"
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
              </div>

              <div className="filter-select-item">
                <span className="filter-select-item__price">Mức giá</span>
                <span className="filter-select-item__icon">
                  <svg
                    stroke="%23000000"
                    fill="%23000000"
                    stroke-width="0"
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
              </div>

              <div className="refresh">
                <SlRefresh />
              </div>
            </div>
          </div>

          <div className="clinic-doctors u-wrapper">
            {pageClinicDoctors
              ? doctorsById.length > 0 &&
                doctorsById.map((doctor) => {
                  return (
                    <Doctor
                      key={doctor.doctorId}
                      doctorId={doctor.doctorId}
                      onToggleModal={handleModal}
                      doctorData={doctor}
                      assurance
                      needAddress
                      remote={0}
                    />
                  );
                })
              : packageArr.length > 0 &&
                packageArr.map((pk) => {
                  return (
                    <Package
                      key={pk.id}
                      packageId={pk.id}
                      onToggleModal={handleModal}
                      packageData={pk}
                      assurance
                      needAddress
                      packageClinic={1}
                      packageClinicSpecialty={packageClinicSpecialty}
                    />
                  );
                })}
          </div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={() => handleModal()}
              doctorId={state.doctorId ? state.doctorId : ""}
              packageId={state.packageId ? state.packageId : ""}
              doctorData={dataModalBooking(language, state.doctorData, "doctor")}
              packageData={dataModalBooking(language, state.packageData, "package")}
              hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
              remote={0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicCarouselMore;

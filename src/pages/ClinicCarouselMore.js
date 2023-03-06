import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ClinicTop, InputSearch, Doctor, Package, ModalBooking } from "../components";
import { getClinic } from "../slices/clinicSlice";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getAllDoctorsById, getDoctor } from "../slices/doctorSlice";
import { useFetchDataBaseId, useDataModal } from "../utils/CustomHook";
import { GoSearch } from "react-icons/go";
import { SlRefresh } from "react-icons/sl";
import "../styles/ClinicCarouselMore.scss";

const initialState = {
  inputSearch: "",
  isOpenModalBooking: false,
  hourBooked: "",

  doctorId: "",
  doctorData: {},
  packageId: "",
  packageData: {},
  action: "",
};

const ClinicCarouselMore = ({ pageClinicDoctors }) => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);
  const { doctorsById } = useSelector((store) => store.doctor);
  const { packageArr } = useSelector((store) => store.package);
  const dataClinic = useFetchDataBaseId(clinicId ? +clinicId : "", "clinic", getClinic);
  const dataModal = useDataModal(
    language,
    state[pageClinicDoctors ? "doctorData" : "packageData"],
    pageClinicDoctors ? "doctor" : "package",
    state.hourClicked
  );

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
      console.log(res);

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
              <div className="filter-select-category">
                <select id="test" className="clinics-actions-filter__list">
                  <option value="Tỉnh thành">{language === "vi" ? "Danh mục" : "Category"}</option>
                  <option value="Thành phố Hồ Chí Minh">
                    {language === "vi" ? "Thành phố Hồ Chí Minh" : "Ho Chi Minh City"}
                  </option>
                  <option value="Thành phố Hà Nội">
                    {language === "vi" ? "Thành phố Hà Nội" : "Ha Noi City"}
                  </option>
                </select>
              </div>

              <div className="filter-select-price">
                <select id="test" className="clinics-actions-filter__list">
                  <option value="Tỉnh thành">{language === "vi" ? "Mức giá" : "Price"}</option>
                  <option value="Thành phố Hồ Chí Minh">
                    {language === "vi" ? "Thành phố Hồ Chí Minh" : "Ho Chi Minh City"}
                  </option>
                  <option value="Thành phố Hà Nội">
                    {language === "vi" ? "Thành phố Hà Nội" : "Ha Noi City"}
                  </option>
                </select>
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
                      packageClinicSpecialty={0}
                    />
                  );
                })}
          </div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={() => handleModal()}
              doctorId={state.doctorId ? state.doctorId : ""}
              doctorData={!_.isEmpty(dataModal) && state.doctorId ? dataModal : {}}
              packageData={!_.isEmpty(dataModal) && state.packageId ? dataModal : {}}
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

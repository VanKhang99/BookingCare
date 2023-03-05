import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ClinicTop, InputSearch, Doctor, ModalBooking } from "../components";
import { getClinic } from "../slices/clinicSlice";
import { getAllDoctorsById, getDoctor } from "../slices/doctorSlice";
import { useFetchDataBaseId, useDataModal } from "../utils/CustomHook";
import { GoSearch } from "react-icons/go";
import { SlRefresh } from "react-icons/sl";
import "../styles/ClinicDoctors.scss";

const initialState = {
  inputSearch: "",
  isOpenModalBooking: false,
  hourBooked: "",

  doctorId: "",
  doctorData: {},
  action: "",
};

const ClinicDoctors = () => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);
  const { doctorsById } = useSelector((store) => store.doctor);
  const dataClinic = useFetchDataBaseId(clinicId ? +clinicId : "", "clinic", getClinic);
  const dataModal = useDataModal(language, state.doctorData, state.hourClicked);

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
    // console.log(action);
    try {
      const res = await dispatch(getDoctor(+doctorId));

      if (res?.payload?.data) {
        return setState({
          ...state,
          doctorData: res.payload.data,
          doctorId,
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
    dispatch(getAllDoctorsById({ nameColumnMap: "clinicId", id: +clinicId }));
  }, []);

  console.log(state.doctorData);
  return (
    <div className="clinic-doctors-container">
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
            {doctorsById.length > 0 &&
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
              })}
          </div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={() => handleModal()}
              doctorId={state.doctorId ? state.doctorId : ""}
              doctorData={!_.isEmpty(dataModal) ? dataModal : {}}
              hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
              remote={0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicDoctors;

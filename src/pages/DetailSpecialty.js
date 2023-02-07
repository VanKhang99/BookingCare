import React, { useState, useEffect, useMemo } from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getInfoSpecialty } from "../slices/specialtySlice";
import { getDetailDoctor, getDoctorsBaseKeyMap } from "../slices/doctorSlice";
import {
  Header,
  Footer,
  IntroSpecialty,
  Doctor,
  ModalBooking,
  ProvinceOptions,
  RoleBookingCare,
} from "../components";
import "../styles/DetailSpecialty.scss";

const initialState = {
  specialtyData: {},
  isOpenFullIntro: false,
  isOpenModalBooking: false,
  hourBooked: {},
  doctors: [],
  doctorId: "",
  doctorData: {},
};

const DetailSpecialty = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { specialtyId } = useParams();

  const doctorsFilter = useMemo(async () => {
    const res = await dispatch(getDoctorsBaseKeyMap({ keyMapId: specialtyId, remote }));

    if (res?.payload?.data.length > 0) return res.payload.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchDataSpecialty = async (id) => {
    try {
      const data = await Promise.all([
        dispatch(getInfoSpecialty(id)),
        dispatch(getDoctorsBaseKeyMap({ keyMapId: id, remote })),
      ]);

      return setState({
        ...state,
        specialtyData: { ...data[0].payload.specialty },
        doctors: [...data[1].payload.data],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMoreDataIntro = () => {
    return setState({ ...state, isOpenFullIntro: !state.isOpenFullIntro });
  };

  const handleModal = async (hourClicked, doctorId) => {
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to DetailSpecialty
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking

    try {
      if (!doctorId)
        return setState({
          ...state,
          isOpenModalBooking: !state.isOpenModalBooking,
        });

      const res = await dispatch(getDetailDoctor(+doctorId));
      if (res?.payload?.data) {
        return setState({
          ...state,
          doctorData: res.payload.data,
          doctorId,
          isOpenModalBooking: !state.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProvinceChange = async (option) => {
    const doctorsCopy = await doctorsFilter;
    console.log(doctorsCopy);

    if (option.value === "*") {
      return setState({ ...state, doctors: doctorsCopy });
    }

    if (option.value !== "*") {
      const newDoctors = doctorsCopy.filter((doctor) => doctor.provinceId === option.value);
      return setState({ ...state, doctors: newDoctors });
    }
  };

  useEffect(() => {
    if (specialtyId) {
      handleFetchDataSpecialty(specialtyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="specialty-container">
      <div className="specialty">
        <Header />

        <div className="specialty-content ">
          <div className="specialty-intro">
            <IntroSpecialty
              isOpenFullIntro={state.isOpenFullIntro}
              specialtyData={state.specialtyData}
              onShowMoreDataIntro={handleShowMoreDataIntro}
              remote={remote}
            />
          </div>

          <div className="specialty-doctors">
            <div className="u-wrapper">
              <h2 className="specialty-doctors__title">Các bác sĩ chuyên khoa</h2>

              <ProvinceOptions
                specialtyId={specialtyId ? specialtyId : ""}
                onProvinceChange={handleProvinceChange}
                remote={remote}
              />

              <ul className="doctors">
                {state?.doctors?.length > 0 &&
                  state.doctors.map((doctor, index) => {
                    const doctorId = doctor.doctorId;
                    return (
                      <Doctor
                        key={index}
                        doctorId={doctorId}
                        doctorData={doctor}
                        onToggleModal={handleModal}
                        needAddress={remote ? false : true}
                        assurance={remote ? false : true}
                        remote={remote}
                      />
                    );
                  })}
              </ul>
            </div>
          </div>
          <RoleBookingCare />
        </div>

        <div className="specialty-footer">
          <div className="more-explore">
            <p className="u-wrapper">
              Cần tìm hiểu thêm? <a href="#">Xem câu hỏi thường gặp</a>
            </p>
          </div>
          <Footer />
        </div>
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={state.isOpenModalBooking}
          onHide={() => handleModal()}
          doctorId={state.doctorId ? state.doctorId : ""}
          doctor={state.doctorData ? state.doctorData : {}}
          hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
          remote={remote}
        />
      </div>
    </div>
  );
};

export default DetailSpecialty;

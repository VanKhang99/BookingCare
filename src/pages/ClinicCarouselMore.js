import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { Element } from "react-scroll";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClinicTop, Doctor, Package, ModalBooking, Filter } from "../components";
import { getClinic } from "../slices/clinicSlice";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getAllDoctorsById, getDoctor } from "../slices/doctorSlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { dataModalBooking } from "../utils/helpers";
import "../styles/ClinicCarouselMore.scss";

const initialState = {
  isOpenModalBooking: false,
  hourBooked: "",

  doctorId: "",
  doctorData: {},
  packageId: "",
  packageData: {},
};

const ClinicCarouselMore = ({ pageClinicDoctors, packageClinicSpecialty }) => {
  const [state, setState] = useState({ ...initialState });
  const [packageToRender, setPackageToRender] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const dispatch = useDispatch();
  const { clinicId, specialtyId } = useParams();
  const { language } = useSelector((store) => store.app);
  const { doctorsById } = useSelector((store) => store.doctor);
  const { packageArr } = useSelector((store) => store.package);
  const dataClinic = useFetchDataBaseId(clinicId ? +clinicId : "", "clinic", getClinic);

  const handleModal = async (hourClicked, doctorId = null, packageId = null) => {
    // console.log("test");
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking
    try {
      if (!doctorId && !packageId) {
        return setState({
          ...state,
          isOpenModalBooking: !state.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });
      }

      const res = pageClinicDoctors
        ? await dispatch(getDoctor(+doctorId))
        : await dispatch(getPackage(+packageId));

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilteredData = (arr) => {
    setDataFiltered(arr);
  };

  const handleHideCategoryIntro = () => {
    setState({ ...state, hideCategoryIntro: false });
  };

  useEffect(() => {
    if (pageClinicDoctors) {
      dispatch(
        getAllDoctorsById({ nameColumnMap: "clinicId", id: +clinicId, typeRemote: "includeTrueAndFalse" })
      );

      return;
    }

    if (!packageArr.length) {
      const dispatchedThunk = dispatch(getAllPackages());

      return () => {
        dispatchedThunk.abort();
      };
    }

    if (packageClinicSpecialty) {
      const packagesFilterById = packageArr.filter(
        (pk) => +pk.specialtyId === +specialtyId && +pk.clinicId === +clinicId
      );
      setPackageToRender(packagesFilterById);
    } else {
      const packagesFilterById = packageArr.filter(
        (pk) => pk.specialtyId === null && +pk.clinicId === +clinicId
      );
      setPackageToRender(packagesFilterById);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageArr.length]);

  return (
    <div className="clinic-carousel-container">
      {!_.isEmpty(dataClinic) && (
        <>
          <ClinicTop
            clinicId={+clinicId}
            dataClinic={dataClinic}
            clinicCarouselMore={true}
            packageClinicSpecialty={packageClinicSpecialty}
          />

          <div style={{ borderTop: "1px solid #eee" }}></div>

          <Filter
            pageClinicDoctors={pageClinicDoctors}
            packageClinicSpecialty={packageClinicSpecialty}
            clinicId={clinicId}
            doctorsById={doctorsById}
            packageArr={packageToRender}
            dataFiltered={dataFiltered?.length > 0 ? dataFiltered : []}
            onFilteredData={handleFilteredData}
            onHideCategoryIntro={handleHideCategoryIntro}
          />

          <Element name={language === "vi" ? "Đặt lịch khám" : "Booking"}>
            <div className={`clinic-${pageClinicDoctors ? "doctors" : "packages"} u-wrapper`}>
              {pageClinicDoctors
                ? dataFiltered?.length > 0 &&
                  dataFiltered.map((doctor) => {
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
                : dataFiltered?.length > 0 &&
                  dataFiltered.map((pk) => {
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
          </Element>

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

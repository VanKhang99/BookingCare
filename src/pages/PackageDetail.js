import React, { useState, useCallback } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getPackage } from "../slices/packageSlice";
import { getSchedules } from "../slices/scheduleSlice";
import {
  Header,
  Footer,
  DateOptions,
  BookingHours,
  ClinicInfo,
  ModalBooking,
  Introduce,
} from "../components";

import "../styles/PackageDetail.scss";

const initialState = {
  isOpenModalBooking: false,
  hourClicked: {},
  schedules: [],
};

const PackageDetail = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { packageId } = useParams();
  const packageData = useFetchDataBaseId(packageId, "package", getPackage);

  const handleModal = (hourClicked) => {
    return setState({
      ...state,
      isOpenModalBooking: !state.isOpenModalBooking,
      hourClicked: { ...hourClicked },
    });
  };

  const handleGetSchedules = async (id, timeStamp) => {
    try {
      const res = await dispatch(getSchedules({ id: +id, timeStamp: `${timeStamp}`, keyMap: "packageId" }));
      if (res?.payload?.schedules) {
        return setState({ ...state, schedules: res.payload.schedules });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePackageDataOnModal = useCallback(() => {
    if (_.isEmpty(packageData)) return;

    const dataPackageModal = {
      nameEn: packageData.nameEn,
      nameVi: packageData.nameVi,
      image: packageData.clinicData.logo,
      price: packageData.pricePackage,
      clinicName: packageData.clinicName,
      priceId: packageData.priceId,
    };
    return dataPackageModal;
  }, [state.hourClicked]);

  return (
    <div className="package-detail-container">
      <Header />
      <div className="package-detail-body">
        <Introduce id={packageId ? packageId : ""} packageData={packageData ? packageData : {}} />

        <div className="schedule u-wrapper">
          <DateOptions id={packageId ? packageId : ""} inSpecialty onGetSchedules={handleGetSchedules} />

          <div className="hours-address-price row">
            <BookingHours schedules={state.schedules ? state.schedules : []} onToggleModal={handleModal} />
            <ClinicInfo id={packageId} needAddress={true} packageData={packageData ? packageData : {}} />
          </div>
        </div>

        <div className="package-detail-content">
          <div className="package-include">
            <div className="u-wrapper">
              {packageData?.contentHTML && HtmlReactParser(packageData.contentHTML)}
            </div>
          </div>

          {window.location.href.includes("package-clinic") && (
            <div className="package-list-exam">
              <div className="u-wrapper">
                {packageData?.listExaminationHTML && HtmlReactParser(packageData.listExaminationHTML)}
              </div>
            </div>
          )}
        </div>

        <div className="package-detail-feedback u-wrapper">Feedback</div>
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={state.isOpenModalBooking}
          onHide={() => handleModal()}
          packageId={packageId ? packageId : ""}
          packageData={handlePackageDataOnModal()}
          hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
        />
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetail;

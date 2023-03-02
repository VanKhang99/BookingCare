import React, { useState, useCallback } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getPackage } from "../slices/packageSlice";
import { getSchedules } from "../slices/scheduleSlice";
import { DateOptions, BookingHours, ClinicInfo, ModalBooking, Introduce, Loading } from "../components";

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
  console.log(packageData);
  console.log(packageId);

  const handleModal = (hourClicked) => {
    return setState({
      ...state,
      isOpenModalBooking: !state.isOpenModalBooking,
      hourClicked: { ...hourClicked },
    });
  };

  const handleUpdateSchedules = (schedulesArr) => {
    return setState({ ...state, schedules: schedulesArr });
  };

  const handlePackageDataOnModal = useCallback(() => {
    if (_.isEmpty(packageData)) return;

    const dataPackageModal = {
      nameEn: packageData.nameEn,
      nameVi: packageData.nameVi,
      image: packageData.imageUrl,
      price: packageData.pricePackage,
      clinicName: packageData.clinicName,
      priceId: packageData.priceId,
    };
    return dataPackageModal;
  }, [state.hourClicked]);

  return (
    <div className="package-container">
      {!_.isEmpty(packageData) ? (
        <>
          <Introduce id={+packageId} packageData={packageData} />

          <div className="schedule u-wrapper">
            <DateOptions
              id={packageId ? packageId : ""}
              inSpecialty
              onUpdateSchedules={handleUpdateSchedules}
              keyMapFetchPackage="packageId"
            />

            <div className="hours-address-price row">
              <BookingHours schedules={state.schedules ? state.schedules : []} onToggleModal={handleModal} />
              <ClinicInfo id={+packageId} needAddress={true} packageData={packageData} />
            </div>
          </div>

          <div className="package-content">
            <div className="package-content__include">
              <div className="u-wrapper">
                {packageData?.contentHTML && HtmlReactParser(packageData.contentHTML)}
              </div>
            </div>

            {window.location.href.includes("package-clinic") && (
              <div className="package-content__list-exam">
                <div className="u-wrapper">
                  {packageData?.listExaminationHTML && HtmlReactParser(packageData.listExaminationHTML)}
                </div>
              </div>
            )}
          </div>

          <div className="package-feedback u-wrapper">Feedback</div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={() => handleModal()}
              packageId={packageId ? packageId : ""}
              packageData={handlePackageDataOnModal()}
              hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default PackageDetail;

import React, { useState, useCallback } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getPackage } from "../slices/packageSlice";
import { dataModalBooking } from "../utils/helpers";
import { DateOptions, BookingHours, ClinicInfo, ModalBooking, Introduce, Loading } from "../components";

import "../styles/PackageDetail.scss";

const initialState = {
  isOpenModalBooking: false,
  hourClicked: "",
  schedules: [],
};

const PackageDetail = ({ packageOfClinic }) => {
  const [state, setState] = useState({ ...initialState });
  const { packageId } = useParams();
  const { language } = useSelector((store) => store.app);
  const packageData = useFetchDataBaseId(packageId, "package", getPackage);

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
              <ClinicInfo
                id={+packageId}
                needAddress={true}
                packageData={packageData}
                packageOfClinic={packageOfClinic}
              />
            </div>
          </div>

          <div className="package-content">
            <div className="package-content__include">
              <div className="u-wrapper">
                {packageData.contentHTML && HtmlReactParser(packageData.contentHTML)}
              </div>
            </div>

            {window.location.href.includes("package-clinic") && (
              <div className="package-content__list-exam">
                <div className="u-wrapper">
                  {packageData.listExaminationHTML && HtmlReactParser(packageData.listExaminationHTML)}
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
              packageData={dataModalBooking(language, packageData, "package")}
              hourClicked={!_.isEmpty(state.hourClicked) && state.hourClicked}
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

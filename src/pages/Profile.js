import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BsDatabaseUp, BsHospital, BsCardChecklist } from "react-icons/bs";
import { MdSecurity } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineUpload } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import {
  UpdateInformation,
  ChangePassword,
  MedicalAppointmentHistory,
  PurchaseHistory,
  PatientBooking,
  Loading,
  Language,
} from "../components";
import { ScheduleWrapper } from "../system";

import { logout, updateDataUser } from "../slices/userSlice";
import { postImageToS3, deleteImageOnS3 } from "../utils/helpers";
import { TIMEOUT_NAVIGATE } from "../utils/constants";
import "../styles/Profile.scss";

const initialState = {
  isShowUpdateInformation: true,
  isShowChangePassword: false,
  isShowMedicalAppointmentHistory: false,
  isShowPurchaseHistory: false,
  isShowListOfAppointment: false,
  isShowCreateSchedule: false,
};

const Profile = () => {
  const [profileState, setProfileState] = useState(initialState);
  const [backToLogin, setBackToLogin] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { userInfo, socialLogin } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const handleDisplayGender = () => {
    if (!userInfo?.gender) return;

    if (userInfo.gender === "M") {
      return language === "vi" ? "Nam" : "Men";
    }

    if (userInfo.gender === "F") {
      return language === "vi" ? "Nữ" : "Female";
    }

    return language === "vi" ? "Khác" : "Other";
  };

  const handleChangeImage = async (e) => {
    try {
      if (!e.target.files || !e.target.files.length) return;
      const file = e.target.files[0];

      if (userInfo.image) {
        await deleteImageOnS3(userInfo.image);
      }

      const imageUploadToS3 = await postImageToS3(file);
      if (imageUploadToS3.data.status !== "success") {
        return toast.error(
          language === "vi"
            ? "Có lỗi xảy ra trong quá trình cập nhật hình ảnh. Vui lòng thử lại hoặc quay lại sau!"
            : "An error occurred while updating the image. Please try again or come back later!"
        );
      }
      const newImage = imageUploadToS3.data.data.image;
      const resultUpdated = await dispatch(updateDataUser({ id: userInfo.id, image: newImage }));
      console.log(resultUpdated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = async () => {
    try {
      setBackToLogin(true);
      setTimeout(async () => {
        await dispatch(logout());
        navigate("/login");
      }, TIMEOUT_NAVIGATE);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowFeature = (featureShowed) => {
    setProfileState({ ...initialState, isShowUpdateInformation: false, [`isShow${featureShowed}`]: true });
  };

  useEffect(() => {
    document.title = language === "vi" ? `Trang thông tin cá nhân` : `Personal information page`;
  }, [language]);

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile-left">
          <div className="profile-left-top">
            <div className="profile-left-top__logo" onClick={() => navigate("/")}></div>
            <Language />
          </div>

          <div className="profile-portrait">
            {!socialLogin ? (
              <>
                <label htmlFor="changeImage" className="profile-portrait__label">
                  <img
                    src={
                      userInfo?.imageUrl
                        ? userInfo.imageUrl
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                    }
                    alt=""
                    className="profile-portrait__label-img"
                  />

                  <div className="profile-portrait--hover">
                    <span>
                      <HiOutlineUpload />
                    </span>
                  </div>
                </label>

                <input type="file" id="changeImage" onChange={handleChangeImage} hidden />
              </>
            ) : (
              <img
                src={
                  userInfo?.imageUrl
                    ? userInfo.imageUrl
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                }
                alt=""
                className="profile-portrait__img"
              />
            )}

            <h3 className="profile-portrait__name" style={{ marginTop: socialLogin ? "0.8rem" : "0rem" }}>
              {language === "vi"
                ? `${userInfo?.lastName} ${userInfo?.firstName}`
                : `${userInfo?.firstName} ${userInfo?.lastName}`}
            </h3>

            {socialLogin && <div className="profile-portrait__email">test@gmail.com</div>}
          </div>

          {!socialLogin && (
            <div className="profile-detail">
              <div className="profile-detail__title">{t("profile.profile-detail")}</div>

              <div className="profile-detail-list">
                <div className="profile-detail-item">
                  <span className="profile-detail-item__label">Email</span>

                  <span className="profile-detail-item__data">{userInfo?.email}</span>
                </div>

                <div className="profile-detail-item">
                  <span className="profile-detail-item__label">{t("profile.phone-number")}</span>

                  <span className="profile-detail-item__data">{userInfo?.phoneNumber}</span>
                </div>

                <div className="profile-detail-item">
                  <span className="profile-detail-item__label">{t("profile.address")}</span>

                  <span className="profile-detail-item__data">{userInfo?.address}</span>
                </div>

                {userInfo && userInfo.roleId !== "R1" && userInfo.roleId !== "R7" && (
                  <>
                    <div className="profile-detail-item">
                      <span className="profile-detail-item__label">{t("profile.role")}</span>

                      <span className="profile-detail-item__data">
                        {language === "vi" ? userInfo.roleData?.valueVi : userInfo.roleData?.valueEn}
                      </span>
                    </div>

                    <div className="profile-detail-item">
                      <span className="profile-detail-item__label">{t("profile.degree")}</span>

                      <span className="profile-detail-item__data">
                        {language === "vi" ? userInfo.positionData?.valueVi : userInfo.positionData?.valueEn}
                      </span>
                    </div>
                  </>
                )}

                <div className="profile-detail-item">
                  <span className="profile-detail-item__label">{t("profile.gender")}</span>

                  <span className="profile-detail-item__data">{handleDisplayGender()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="profile-actions">
            <div className="profile-actions__title">{t("profile.actions")}</div>

            <div className="profile-actions-list">
              {!socialLogin && (
                <>
                  <div
                    className={`profile-actions-item ${
                      profileState.isShowUpdateInformation ? "profile-actions-item--active" : ""
                    }`}
                    onClick={() => handleShowFeature("UpdateInformation")}
                  >
                    <div className="profile-actions-item__icon">
                      <BsDatabaseUp />
                    </div>
                    <span>{t("profile.update-information")}</span>
                  </div>

                  <div
                    className={`profile-actions-item ${
                      profileState.isShowChangePassword ? "profile-actions-item--active" : ""
                    }`}
                    onClick={() => handleShowFeature("ChangePassword")}
                  >
                    <div className="profile-actions-item__icon">
                      <MdSecurity />
                    </div>
                    <span>{t("profile.change-password")}</span>
                  </div>
                </>
              )}

              {userInfo && userInfo.roleId === "R7" && (
                <>
                  <div
                    className={`profile-actions-item ${
                      profileState.isShowMedicalAppointmentHistory ? "profile-actions-item--active" : ""
                    }`}
                    onClick={() => handleShowFeature("MedicalAppointmentHistory")}
                  >
                    <div className="profile-actions-item__icon">
                      <BsHospital />
                    </div>
                    <span>{t("profile.medical-appointment-history")}</span>
                  </div>

                  <div
                    className={`profile-actions-item ${
                      profileState.isShowPurchaseHistory ? "profile-actions-item--active" : ""
                    }`}
                    onClick={() => handleShowFeature("PurchaseHistory")}
                  >
                    <div className="profile-actions-item__icon">
                      <HiOutlineShoppingBag />
                    </div>
                    <span>{t("profile.purchase-history")}</span>
                  </div>
                </>
              )}

              {userInfo && userInfo.roleId !== "R7" && (
                <>
                  <div
                    className={`profile-actions-item ${
                      profileState.isShowListOfAppointment ? "profile-actions-item--active" : ""
                    }`}
                    onClick={() => handleShowFeature("ListOfAppointment")}
                  >
                    <div className="profile-actions-item__icon">
                      <BsCardChecklist />
                    </div>
                    <span>{t("profile.list-patient-appointment")}</span>
                  </div>

                  <div
                    className={`profile-actions-item ${
                      profileState.isShowCreateSchedule ? "profile-actions-item--active" : ""
                    }`}
                    onClick={() => handleShowFeature("CreateSchedule")}
                  >
                    <div className="profile-actions-item__icon">
                      <FiClock />
                    </div>
                    <span>{t("profile.create-time-frame")}</span>
                  </div>
                </>
              )}

              <div className="profile-actions-item" onClick={handleLogOut}>
                <div className="profile-actions-item__icon">
                  <IoLogOutOutline />
                </div>
                <span>{t("profile.log-out")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          {profileState.isShowUpdateInformation && <UpdateInformation />}
          {profileState.isShowChangePassword && <ChangePassword />}
          {profileState.isShowMedicalAppointmentHistory && <MedicalAppointmentHistory />}
          {profileState.isShowPurchaseHistory && <PurchaseHistory />}
          {profileState.isShowListOfAppointment && <PatientBooking />}
          {profileState.isShowCreateSchedule && <ScheduleWrapper isDoctorAccount={true} profilePage={true} />}
        </div>
      </div>

      {backToLogin && <Loading />}
    </div>
  );
};

export default Profile;

// PROFILE-CONTAINER
// LEFT

// RIGHT

import React, { useState } from "react";
import { Loading } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BsEmojiSmile } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../slices/userSlice";
import { TIMEOUT_NAVIGATE } from "../utils/constants";
import "../styles/LoginModal.scss";

const LoginModal = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [backToLogin, setBackToLogin] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setShowLoginModal(!showLoginModal);
      setBackToLogin(true);
      setTimeout(async () => {
        await dispatch(logout());
        navigate("/login");
      }, TIMEOUT_NAVIGATE);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigate = () => {
    if (!userInfo?.roleId) return;

    if (userInfo.roleId === "R1") {
      return "/admin-system";
    } else if (userInfo.roleId === "R7") {
      return "/personal-center";
    } else {
      return "/doctor-system";
    }
  };

  return (
    <>
      <div className="user">
        <img
          src={
            userInfo?.imageUrl
              ? userInfo.imageUrl
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
          }
          alt={
            language === "vi"
              ? `${userInfo?.lastName} ${userInfo?.firstName}`
              : `${userInfo?.firstName} ${userInfo?.lastName}`
          }
          onClick={() => setShowLoginModal(!showLoginModal)}
        />
        <div className={showLoginModal ? "login-modal open" : "login-modal"}>
          <div className="login-modal-top">
            <img
              src={
                userInfo?.imageUrl
                  ? userInfo.imageUrl
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
              }
              alt={
                language === "vi"
                  ? `${userInfo?.lastName} ${userInfo?.firstName}`
                  : `${userInfo?.firstName} ${userInfo?.lastName}`
              }
              className="login-modal-top__image"
            />
            <span className="login-modal-top__name">
              {language === "vi"
                ? `${userInfo?.lastName} ${userInfo?.firstName}`
                : `${userInfo?.firstName} ${userInfo?.lastName}`}
            </span>
          </div>

          <div className="login-modal-bottom">
            <Link to={handleNavigate()} className="login-modal-bottom__left">
              <BsEmojiSmile />
              <span>
                {userInfo?.roleId === "R1"
                  ? t("login-modal.management-center")
                  : t("login-modal.personal-center")}
              </span>
            </Link>
            <div className="login-modal-bottom__right" onClick={handleLogout}>
              <IoLogOutOutline />
              <span>{t("login-modal.logout")}</span>
            </div>
          </div>
        </div>

        {backToLogin && <Loading />}
      </div>
    </>
  );
};

export default LoginModal;

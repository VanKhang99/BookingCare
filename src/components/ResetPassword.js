import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TermUse, Loading } from "../components";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { IoChevronBack } from "react-icons/io5";
import { resetPassword, autoLogin } from "../slices/userSlice";
import { TIMEOUT_NAVIGATE } from "../utils/constants";
import "../styles/ResetPassword.scss";

const initialState = {
  newPassword: "",
  confirmNewPassword: "",
};

const ResetPassword = ({ onShowResetPassword, email, confirmCode }) => {
  const [stateRP, setStateRP] = useState(initialState);
  const [backHomePage, setBackHomePage] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const navigate = useNavigate();

  const handleInputChange = (changedValues) => {
    const stateRPCopy = { ...stateRP };
    stateRPCopy[Object.keys(changedValues)[0]] = Object.values(changedValues)[0];
    setStateRP({ ...stateRPCopy });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    try {
      if (!stateRP.newPassword || !stateRP.confirmNewPassword) {
        return toast.error(
          language === "vi"
            ? "Vui lòng điền đẩy đủ thông tin trước khi ấn xác nhận!"
            : "Please fill in all information before pressing confirm!"
        );
      }
      if (stateRP.newPassword !== stateRP.confirmNewPassword) {
        return toast.error(
          language === "vi"
            ? "Hai mật khẩu không giống nhau. Vui lòng kiểm tra lại!"
            : "The two passwords are not the same. Please check again!"
        );
      }

      const result = await dispatch(
        resetPassword({
          password: stateRP.newPassword,
          email,
          confirmCode,
          language,
        })
      );

      if (result.payload?.status === "success") {
        const dataUser = result.payload.data.user;
        const dataSaveToLocal = {
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          imageUrl: dataUser.imageUrl || null,
          roleId: dataUser.roleId,
        };

        localStorage.setItem("userInfo", JSON.stringify(dataSaveToLocal));

        setBackHomePage(true);
        setTimeout(async () => {
          await dispatch(autoLogin(dataUser));
          navigate("/");
        }, TIMEOUT_NAVIGATE);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password__go-back" onClick={onShowResetPassword}>
        <IoChevronBack />
      </div>

      <div className="forgot-password__title">{t("forgot-password.password-retrieval")}</div>

      <Form className="form form--reset-password" layout="vertical" onValuesChange={handleInputChange}>
        <Form.Item
          className="form__password"
          label={t("forgot-password.label-new-password")}
          name="newPassword"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("forgot-password.password"));
                }

                if (!(value.length >= 8)) {
                  return Promise.reject(t("forgot-password.password-valid"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            type="password"
            name="newPassword"
            value={stateRP.newPassword}
            prefix={
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="lock"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"></path>
              </svg>
            }
            placeholder={t("forgot-password.placeholder-password")}
            className="custom-input"
            minLength="8"
            autoComplete="on"
          />
        </Form.Item>

        <Form.Item
          className="form__password-confirm"
          label={t("forgot-password.label-renew-password")}
          name="confirmNewPassword"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("forgot-password.password-confirm"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            type="password"
            name="confirmNewPassword"
            value={stateRP.confirmNewPassword}
            prefix={
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="lock"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"></path>
              </svg>
            }
            placeholder={t("forgot-password.placeholder-password-confirm")}
            className="custom-input"
            minLength="8"
            autoComplete="on"
          />
        </Form.Item>

        <button className="form-button form-button--confirm" onClick={(e) => handleConfirm(e)}>
          <span>{t("button.confirm")}</span>
        </button>
      </Form>

      <TermUse />

      {backHomePage && <Loading />}
    </div>
  );
};

export default ResetPassword;

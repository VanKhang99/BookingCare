import React, { useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../slices/userSlice";
import "../../styles/ChangePassword.scss";

const ChangePassword = () => {
  const [changePasswordState, setChangePasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleInputChange = (changedValues) => {
    const changePasswordCopy = { ...changePasswordState };
    changePasswordCopy[Object.keys(changedValues)[0]] = Object.values(changedValues)[0];
    setChangePasswordState({ ...changePasswordCopy });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(updatePassword({ language, ...changePasswordState }));
      if (result.payload.status === "error") {
        return toast.error(result.payload.message);
      }

      toast.success(language === "vi" ? "Thay đổi mật khẩu thành công!" : "Password change successful!");
      form.resetFields();
      setChangePasswordState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      localStorage.setItem("token", result.payload.token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="change-password">
      <h2 className="profile-heading">{t("profile.change-password")}</h2>

      <Form form={form} className="form-change-password" layout="vertical" onValuesChange={handleInputChange}>
        <Form.Item
          label={t("password.label-current-password")}
          name="currentPassword"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("password.current-password"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            type="password"
            name="currentPassword"
            // value={stateRP.newPassword}
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
            placeholder={t("password.placeholder-current-password")}
            className="custom-input"
            minLength="8"
            autoComplete="on"
          />
        </Form.Item>

        <Form.Item
          label={t("password.label-new-password")}
          name="newPassword"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("password.password"));
                }

                if (!(value.length >= 8)) {
                  return Promise.reject(t("password.password-valid"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            type="password"
            name="newPassword"
            // value={stateRP.newPassword}
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
            placeholder={t("password.placeholder-password")}
            className="custom-input"
            minLength="8"
            autoComplete="on"
          />
        </Form.Item>

        <Form.Item
          label={t("password.label-renew-password")}
          name="confirmNewPassword"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("password.password-confirm"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            type="password"
            name="confirmNewPassword"
            // value={stateRP.confirmNewPassword}
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
            placeholder={t("password.placeholder-password-confirm")}
            className="custom-input"
            minLength="8"
            autoComplete="on"
          />
        </Form.Item>

        <button className="form-change-password__button" onClick={(e) => handleChangePassword(e)}>
          <span>{t("button.confirm")}</span>
        </button>
      </Form>
    </div>
  );
};

export default ChangePassword;

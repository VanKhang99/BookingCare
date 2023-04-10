import React, { useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMail } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { updateDataUser } from "../../slices/userSlice";
import { isValidEmail, isValidPhone, checkData } from "../../utils/helpers";
import "../../styles/UpdateInformation.scss";

const initialState = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
};

const UpdateInformation = () => {
  const [informationState, setInformationState] = useState(initialState);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { userInfo } = useSelector((store) => store.user);

  const handleInputChange = (changedValues) => {
    const informationCopy = { ...informationState };
    informationCopy[Object.keys(changedValues)[0]] = Object.values(changedValues)[0];
    setInformationState({ ...informationCopy });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const propsKeyCheck = Object.keys(informationState);
    const checkFormFillUp = checkData(informationState, propsKeyCheck);

    if (!checkFormFillUp) {
      console.log(informationState);
      return toast.error(
        language === "vi"
          ? "Vui lòng điền đẩy đủ thông tin trước khi cập nhật!"
          : "Please fill in all information before updating!"
      );
    }

    try {
      const res = await dispatch(
        updateDataUser({
          id: userInfo.id,
          ...informationState,
        })
      );

      if (res.payload.status === "success") {
        toast.success(language === "vi" ? "Cập nhật thông tin thành công!" : "Successfully updated!");
        setInformationState({ ...initialState });
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="update-information">
      <h2 className="profile-heading">{t("profile.update-information")}</h2>

      <Form form={form} className="form-update" layout="vertical" onValuesChange={handleInputChange}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("login-register.email-empty"));
                }
                return isValidEmail(value)
                  ? Promise.resolve()
                  : Promise.reject(t("login-register.email-invalid"));
              },
            },
          ]}
        >
          <Input
            type="text"
            name="email"
            disabled={true}
            prefix={<AiOutlineMail style={{ marginTop: "1px" }} />}
            placeholder="Email"
            className="custom-input"
          />
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              name="firstName"
              label={t("profile.first-name")}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value?.length) {
                      return Promise.reject(t("login-register.first-name"));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="text"
                name="firstName"
                value={informationState.firstName}
                prefix={
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="user"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                  </svg>
                }
                placeholder={t("login-register.placeholder-first-name")}
                className="custom-input"
              />
            </Form.Item>
          </div>

          <div className="col-6">
            <Form.Item
              label={t("profile.last-name")}
              name="lastName"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value?.length) {
                      return Promise.reject(t("login-register.last-name"));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="text"
                name="lastName"
                value={informationState.lastName}
                prefix={
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="user"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                  </svg>
                }
                placeholder={t("login-register.placeholder-last-name")}
                className="custom-input"
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          label={t("profile.phone-number")}
          name="phoneNumber"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("login-register.phone"));
                }

                if (!isValidPhone(value)) {
                  return Promise.reject(t("login-register.phone-invalid"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="phone"
            name="phoneNumber"
            value={informationState.phoneNumber}
            prefix={<BsTelephone />}
            placeholder={t("login-register.placeholder-phone")}
            className="custom-input"
          />
        </Form.Item>

        <Form.Item
          label={t("profile.address")}
          name="address"
          rules={[
            {
              validator: (_, value) => {
                if (!value?.length) {
                  return Promise.reject(t("login-register.address"));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="text"
            name="address"
            value={informationState.address}
            prefix={<IoLocationOutline />}
            placeholder={t("login-register.placeholder-address")}
            className="custom-input"
          />
        </Form.Item>
        <button className="form-update__button" onClick={(e) => handleUpdate(e)}>
          <span>{t("button.update")}</span>
        </button>
      </Form>
    </div>
  );
};

export default UpdateInformation;

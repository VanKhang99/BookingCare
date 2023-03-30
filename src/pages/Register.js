import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, signUp, getConfirmCode, verifyCode } from "../slices/userSlice";

import { toast } from "react-toastify";
import { AiOutlineMail, AiOutlineNumber } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { Form, Input, Radio } from "antd";
import { isValidEmail, isValidPhone, checkData } from "../utils/helpers";
import { INTERVAL_COUNTDOWN, EXPIRES_CONFIRM_CODE } from "../utils/constants";
import "../styles/LoginRegister.scss";
import "../styles/CustomForm.scss";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  gender: "",
  confirmCode: "",

  countdownStart: false,
  codeFromServer: "",
  timeStampWhenGettingCode: "",
};

const Login = () => {
  const [userData, setUserData] = useState({ ...initialState });
  const [countDown, setCountDown] = useState(120);
  const [codeFromServer, setCodeFromServer] = useState("");
  const [disableButtonSignup, setDisableButtonSignup] = useState(true);
  const [disableButtonSendCode, setDisableButtonSendCode] = useState(true);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  // const { isLoggedIn, userInfo } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const checkInputUserData = (propsToCheck, objectValues) => {
    const checkFormFillUp = checkData(objectValues, propsToCheck);
    if (
      checkFormFillUp &&
      isValidEmail(objectValues.email) &&
      isValidPhone(objectValues.phoneNumber) &&
      objectValues.password.length >= 8
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleInputChange = (changedValues, allValues) => {
    if (userData.countdownStart) return;
    //handle state of button send code
    const propsKeyCheck = Object.keys(allValues);
    setDisableButtonSendCode(checkInputUserData(propsKeyCheck, allValues));

    //handle userData
    const userDataCopy = { ...userData };
    userDataCopy[Object.keys(changedValues)[0]] = Object.values(changedValues)[0];
    setUserData({ ...userDataCopy });
  };

  const handleChangeRadio = (e) => {
    setUserData({ ...userData, gender: e.target.value });
  };

  const handleInputConfirmCode = (e) => {
    const value = e.target.value;
    let disableButton = true;

    if (value.length <= 7) {
      disableButton = !disableButtonSendCode && value.length === 7 ? false : true;
      setUserData({ ...userData, confirmCode: value });
    } else {
      return;
    }
    setDisableButtonSignup(disableButton);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (disableButtonSendCode) return;

    try {
      const result = await dispatch(
        getConfirmCode({
          email: userData.email,
          language,
        })
      );

      if (result.payload?.status === "success") {
        const timeStampWhenGettingCode = Date.now();
        setUserData({
          ...userData,
          timeStampWhenGettingCode,
          countdownStart: true,
        });
        return;
      }

      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // EXPIRES_CONFIRM_CODE
      const timeStampWhenPressSignup = Date.now();
      const codeIsExpired =
        timeStampWhenPressSignup - userData.timeStampWhenGettingCode > EXPIRES_CONFIRM_CODE;

      if (codeIsExpired) {
        return toast.error(
          "Mã xác nhận tài khoản đã hết hiệu lực. Xin vui lòng thực hiện lại quá trình lấy mã!"
        );
      }

      // const dataUserSendToServer = {
      //   address: userData.address,
      //   email: userData.email,
      //   password: userData.password,
      //   phoneNumber: userData.phoneNumber,
      //   firstName: userData.firstName,
      //   lastName: userData.lastName,
      //   gender: userData.gender,
      // };

      const resultVerifyCode = await dispatch(
        verifyCode({ email: userData.email, confirmCode: userData.confirmCode })
      );
      if (resultVerifyCode.payload.status === "success") {
        // call hàm register
      } else {
        return toast.error("Mã xác nhận bạn cung cấp không đúng. Vui lòng kiểm tra lại!");
      }
      // if (res.payload?.status === "error") {
      //   return toast.error("Email đã được sử dụng. Xin hãy sử dụng email khác!");
      // }
      // const user = res.payload?.data?.user;
      // console.log(user);
      // if (!_.isEmpty(user)) {
      //   const resLogin = await dispatch();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  // const countdown = () => {
  //   if (userData.timeResendCode < 0) {
  //     setUserData({ ...userData, timeResendCode: 120, isGettingCode: true });
  //   }
  // };

  useEffect(() => {
    let timerId;
    if (userData.countdownStart) {
      if (countDown === 120) {
        setDisableButtonSendCode(true);
      }

      timerId = setInterval(() => {
        setCountDown((prevState) => {
          if (prevState === 0) {
            setUserData({ ...userData, countdownStart: false });
            setDisableButtonSendCode(false);
            return 120;
          }
          return prevState - 1;
        });
      }, [50]);
      // INTERVAL_COUNTDOWN
    }
    return () => clearInterval(timerId);
  }, [userData.countdownStart]);

  return (
    <div className="background">
      <div className="back-home">
        <button className="back-home-link" onClick={() => navigate("/")}>
          <BiArrowBack />
          {t("login-register.back-home")}
        </button>
      </div>

      <div className="form-container form-container--register">
        <div className="form-content ">
          <div className="form-content__title">{t("login-register.signup")}</div>

          <Form
            className="form form--register"
            onValuesChange={handleInputChange}
            // onFinish={handleSignUp}
            // onFinishFailed={handleSignUp}
          >
            <Form.Item
              className="form__email"
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
                value={userData.email}
                prefix={<AiOutlineMail style={{ marginTop: "1px" }} />}
                placeholder="Email"
                className="customInput"
                autoFocus
              />
            </Form.Item>

            <Form.Item
              className="form__password"
              name="password"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value?.length) {
                      return Promise.reject(t("login-register.password"));
                    }

                    if (!(value.length >= 8)) {
                      return Promise.reject(t("login-register.password-valid"));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                type="password"
                name="password"
                value={userData.password}
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
                placeholder={t("login-register.placeholder-password")}
                className="customInput"
                minLength="8"
                autoComplete="on"
                // autoFocus
              />
            </Form.Item>

            <Form.Item
              className="form__phone"
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
                value={userData.phoneNumber}
                prefix={<BsTelephone />}
                placeholder={t("login-register.placeholder-phone")}
                className="customInput"
                // autoFocus
              />
            </Form.Item>

            <Form.Item
              name="firstName"
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
                value={userData.firstName}
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
                className="customInput"
                // autoFocus
              />
            </Form.Item>

            <Form.Item
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
                // ref={inputEmailRef}
                type="text"
                name="lastName"
                value={userData.lastName}
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
                className="customInput"
                // autoFocus
              />
            </Form.Item>

            <Form.Item
              className="form__address"
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
                value={userData.address}
                prefix={<IoLocationOutline />}
                placeholder={t("login-register.placeholder-address")}
                className="customInput"
              />
            </Form.Item>

            <Form.Item
              className="form__gender"
              name="gender"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject(t("login-register.gender"));
                    }
                  },
                },
              ]}
            >
              <Radio.Group name="gender" onChange={handleChangeRadio} value={userData.gender}>
                <Radio value="M">Male</Radio>
                <Radio value="F">Female</Radio>
                <Radio value="O">Other</Radio>
              </Radio.Group>
            </Form.Item>

            <div className="form-confirm-code">
              <Form.Item
                className="form-confirm-code__input"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value.length !== 7) {
                        return Promise.reject("Mã xác nhận phải có 7 chữ số");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  value={userData.confirmCode}
                  prefix={<AiOutlineNumber />}
                  placeholder="Mã xác nhận"
                  className="customInput"
                  maxLength="7"
                  onChange={handleInputConfirmCode}
                />
              </Form.Item>

              <button
                className={`form-button form-button--send-code ${
                  disableButtonSendCode ? "form-button--send-code-disable" : "form-button--send-code"
                }`}
                onClick={(e) => handleSendCode(e)}
              >
                {userData.countdownStart ? `Gửi lại mã ${countDown}` : "Gửi mã"}
              </button>
            </div>

            <button
              className={`form-button ${disableButtonSignup ? "form-button--disable" : ""}`}
              onClick={(e) => handleSignUp(e)}
              disabled={disableButtonSignup}
            >
              {t("login-register.signup")}
            </button>
          </Form>

          <div className="have-account">
            <span>{t("login-register.have-account")}</span>
            <Link to="/login"> {t("login-register.login")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

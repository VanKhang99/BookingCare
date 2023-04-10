import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Loading, TermUse } from "../components";
import { AiOutlineMail, AiOutlineNumber } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { Form, Input, Radio } from "antd";
import { isValidEmail, isValidPhone, checkData } from "../utils/helpers";
import { signUp, getConfirmCode, verifyCode, getProfile, autoLogin } from "../slices/userSlice";
import {
  INTERVAL_COUNTDOWN,
  EXPIRES__REGISTER_COUNTDOWN,
  EXPIRES_REGISTER_CONFIRM_CODE,
  TIMEOUT_NAVIGATE,
} from "../utils/constants";
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
  gotVerifyCode: false,
  timeStampWhenGettingCode: "",
};

const Login = () => {
  const [userData, setUserData] = useState({ ...initialState });
  const [countDown, setCountDown] = useState(EXPIRES__REGISTER_COUNTDOWN);
  const [disableButtonSignup, setDisableButtonSignup] = useState(true);
  const [disableButtonSendCode, setDisableButtonSendCode] = useState(true);
  const [backHomePage, setBackHomePage] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
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
    const propsKeyCheck = Object.keys(allValues);
    const disableButton = checkInputUserData(propsKeyCheck, allValues);

    // CASE: current email got coded but see email wrong => re-set some values
    if (userData.countdownStart && userData.gotVerifyCode) {
      if (Object.keys(changedValues)[0] === "email") {
        setUserData({ ...userData, countdownStart: false, gotVerifyCode: false });
        setCountDown(EXPIRES__REGISTER_COUNTDOWN);
        setDisableButtonSendCode(isValidEmail(Object.values(changedValues)[0]) ? false : true);
        return;
      }

      // Change others field data
      setDisableButtonSignup(disableButton);
      setDisableButtonSendCode(true);
      return;
    }

    //handle state of button
    setDisableButtonSendCode(disableButton);
    setDisableButtonSignup(disableButton === false && userData.confirmCode.length === 7 ? false : true);

    //handle userData
    const userDataCopy = { ...userData };
    userDataCopy[Object.keys(changedValues)[0]] = Object.values(changedValues)[0];
    setUserData({ ...userDataCopy });
  };

  const handleChangeRadio = (e) => {
    setUserData({ ...userData, gender: e.target.value });
  };

  const handleInputConfirmCode = (e) => {
    //CASE: countdownStart don't start and not got code => input field code can not change
    if (!userData.countdownStart && !userData.gotVerifyCode) return;

    const value = e.target.value;
    let disableButton = true;

    //CASE: input field code only have 7 numbers and got coded => button sign up is available
    // if get code => run function handleSendCode
    if (value.length <= 7) {
      disableButton = userData.gotVerifyCode && value.length === 7 ? false : true;
      setUserData({ ...userData, confirmCode: value });
    } else {
      return;
    }
    setDisableButtonSignup(disableButton);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    //CASE button send code available => sign up button available too
    if (disableButtonSendCode) return;

    try {
      const result = await dispatch(
        getConfirmCode({
          email: userData.email,
          language,
        })
      );

      if (result.payload?.status === "error") {
        return toast.error(result.payload.message);
      }

      if (result.payload?.status === "success") {
        const timeStampWhenGettingCode = Date.now();
        setUserData({
          ...userData,
          timeStampWhenGettingCode,
          countdownStart: true,
          gotVerifyCode: true,
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const timeStampWhenPressSignup = Date.now();
      const codeIsExpired =
        timeStampWhenPressSignup - userData.timeStampWhenGettingCode > EXPIRES_REGISTER_CONFIRM_CODE;

      if (codeIsExpired) {
        return toast.error(
          language === "vi"
            ? "Mã xác nhận tài khoản đã hết hiệu lực. Xin vui lòng lấy mã khác!"
            : "The account verification code has expired. Please get another code!"
        );
      }

      const resultVerifyCode = await dispatch(
        verifyCode({ email: userData.email, confirmCode: userData.confirmCode })
      );

      if (!resultVerifyCode.payload || resultVerifyCode.payload.status !== "success") {
        return toast.error("Mã xác nhận hoặc email bạn cung cấp không đúng. Vui lòng kiểm tra lại!");
      }

      const dataUserSendToServer = {
        address: userData.address,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
      };
      const resultRegister = await dispatch(signUp({ ...dataUserSendToServer, isNewUser: true }));

      if (resultRegister.payload.status === "success") {
        handleRegistrationSuccess(resultRegister.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegistrationSuccess = async (data) => {
    try {
      // Store the JWT token in local storage or a cookie
      localStorage.setItem("token", data.token);

      // Fetch the user's profile data using the JWT token
      const res = await dispatch(getProfile());
      if (!_.isEmpty(res.payload.data)) {
        const dataSaveToLocal = {
          firstName: res.payload.data.firstName,
          lastName: res.payload.data.lastName,
          imageUrl: null,
          roleId: res.payload.data.roleId,
        };

        localStorage.setItem("userInfo", JSON.stringify(dataSaveToLocal));

        setBackHomePage(true);
        setTimeout(async () => {
          await dispatch(autoLogin(res.payload.data));
          navigate("/");
        }, TIMEOUT_NAVIGATE);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timerId;
    if (userData.countdownStart) {
      if (countDown === EXPIRES__REGISTER_COUNTDOWN) {
        setDisableButtonSendCode(true);
      }

      timerId = setInterval(() => {
        setCountDown((prevState) => {
          if (prevState === 0) {
            setUserData((prevState) => {
              const newState = {
                ...prevState,
                countdownStart: false,
                gotVerifyCode: true,
                confirmCode: prevState.confirmCode,
              };
              return newState;
            });
            setDisableButtonSendCode(false);
            return EXPIRES__REGISTER_COUNTDOWN;
          }

          setDisableButtonSendCode(true);
          return prevState - 1;
        });
      }, [INTERVAL_COUNTDOWN]);
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
                className="custom-input"
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
                className="custom-input"
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
                className="custom-input"
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
                className="custom-input"
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
                className="custom-input"
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
                className="custom-input"
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
                        return Promise.reject(t("login-register.valid-verification-code"));
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
                  placeholder={t("login-register.verification-code")}
                  className="custom-input"
                  maxLength="7"
                  onChange={handleInputConfirmCode}
                />

                <button
                  className={`form-button form-button--send-code ${
                    disableButtonSendCode ? "form-button--send-code-disable" : "form-button--send-code"
                  }`}
                  onClick={(e) => handleSendCode(e)}
                >
                  {userData.countdownStart
                    ? `${t("button.resend-code")} ${countDown}`
                    : t("button.send-code")}
                </button>
              </Form.Item>
            </div>

            <button
              className={`form-button ${
                disableButtonSignup ? "form-button--sign-up-disable" : "form-button--sign-up"
              }`}
              onClick={(e) => handleSignUp(e)}
              disabled={disableButtonSignup}
            >
              <span>{t("login-register.signup")}</span>
            </button>
          </Form>

          <div className="have-account">
            <span>{t("login-register.have-account")}</span>
            <Link to="/login"> {t("login-register.login")}</Link>
          </div>

          <TermUse />
        </div>
      </div>

      {backHomePage && <Loading />}
    </div>
  );
};

export default Login;

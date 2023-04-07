import React, { useState, useEffect } from "react";
import axios from "axios";

import { LoginSocialFacebook } from "reactjs-social-login";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../components";
import { AiOutlineMail } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { Form, Input } from "antd";
import { ForgotPassword, TermUse } from "../components";
import { isValidEmail } from "../utils/helpers";
import { login, socialLogin, autoLogin } from "../slices/userSlice";
import { FACEBOOK_APP_ID, TIMEOUT_NAVIGATE } from "../utils/constants";
import "../styles/LoginRegister.scss";
import "../styles/CustomForm.scss";

const initialState = {
  errorMessage: "",
  email: "",
  password: "",
};

const Login = () => {
  const [state, setState] = useState({ ...initialState });
  const [backHomePage, setBackHomePage] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoggedIn, urlNavigateBack } = useSelector((store) => store.user);
  const { language } = useSelector((store) => store.app);
  const navigate = useNavigate();

  const handleInputChange = (changedValues) => {
    const stateCopy = { ...state };
    stateCopy[changedValues.email ? "email" : "password"] = changedValues.email
      ? changedValues.email
      : changedValues.password;
    setState({ ...stateCopy });
  };

  const handleLogin = async () => {
    setState({ ...state, errorMessage: "" });
    try {
      const res = await dispatch(login({ email: state.email, password: state.password }));
      if (!res.payload) {
        return setState({ ...state, errorMessage: res.error.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const helperLoginBySocial = async (dataUser, token, socialLoginName) => {
    try {
      const firstName = socialLoginName === "google" ? dataUser.given_name : dataUser.first_name;
      const lastName = socialLoginName === "google" ? dataUser.family_name : dataUser.last_name;
      const imageUrl = socialLoginName === "google" ? dataUser.picture : dataUser.picture.data.url;

      const dataSentToServer = {
        firstName,
        lastName,
        email: dataUser.email,
        imageUrl,
        googleFlag: true,
        loginBy: socialLoginName,
      };

      const result = await dispatch(socialLogin(dataSentToServer));

      if (result.payload?.user) {
        const dataSaveToLocal = {
          firstName,
          lastName,
          imageUrl,
          roleId: result.payload.user.roleId || "R7",
        };

        localStorage.setItem("userInfo", JSON.stringify(dataSaveToLocal));
        localStorage.setItem("token", token);
        setBackHomePage(true);
        setTimeout(async () => {
          await dispatch(autoLogin({ ...dataSaveToLocal, id: result.payload.user.id }));
        }, TIMEOUT_NAVIGATE);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: "Bearer " + tokenResponse.access_token },
        });

        if (Object.keys(res.data).length) {
          helperLoginBySocial(res.data, tokenResponse.access_token, "google");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleResponseFacebook = async (response) => {
    try {
      if (Object.keys(response.data).length) {
        helperLoginBySocial(response.data, response.data.accessToken, "facebook");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timerId;
    const token = localStorage.getItem("token");
    if (!token) return;

    setBackHomePage(true);
    timerId = setTimeout(() => {
      navigate(urlNavigateBack ? urlNavigateBack : "/");
    }, TIMEOUT_NAVIGATE);

    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <div className="background">
      <div className="back-home">
        <button className="back-home-link" onClick={() => navigate("/")}>
          <BiArrowBack />
          {t("login-register.back-home")}
        </button>
      </div>

      <div className="form-container">
        {!forgotPassword ? (
          <div className="form-content ">
            <div className="form-content__title"> {t("login-register.login")}</div>

            <div className="auth-social" id="auth-social">
              <button className="auth-google" onClick={loginWithGoogle}>
                <div className="icon">
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#000" fillRule="evenodd">
                      <path
                        d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
                        fill="#EA4335"
                      ></path>
                      <path
                        d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
                        fill="#34A853"
                      ></path>
                      <path fill="none" d="M0 0h18v18H0z"></path>
                    </g>
                  </svg>
                </div>
                <span>Google</span>
              </button>
              <LoginSocialFacebook
                appId={FACEBOOK_APP_ID}
                onResolve={handleResponseFacebook}
                onReject={(error) => console.log(error)}
              >
                <button className="auth-facebook">
                  <div className="icon">
                    <BsFacebook />
                  </div>
                  <span>Facebook</span>
                </button>
              </LoginSocialFacebook>
            </div>

            <div className="or">{language === "vi" ? "hoặc" : "or"}</div>

            <Form
              className="form form--login"
              onValuesChange={handleInputChange}
              onFinish={handleLogin}
              onFinishFailed={handleLogin}
            >
              <Form.Item
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
                  // ref={inputEmailRef}
                  type="text"
                  name="email"
                  prefix={<AiOutlineMail style={{ marginTop: "1px" }} />}
                  placeholder="Email"
                  className="custom-input"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value?.length) {
                        return Promise.reject(t("login-register.password"));
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password
                  type="password"
                  name="password"
                  prefix={
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="lock"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      value={state.password}
                    >
                      <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"></path>
                    </svg>
                  }
                  placeholder={t("login-register.placeholder-password")}
                  className="custom-input"
                  autoComplete="on"
                  // autoFocus
                />
              </Form.Item>

              {state.errorMessage && <div className="error-text">{state.errorMessage}</div>}

              <button className="form-button form-button--login">{t("login-register.login")}</button>
            </Form>

            <div className="no-account">
              <span>{t("login-register.no-account")} </span>
              <Link to="/register">{t("login-register.signup")}</Link>
            </div>

            <div className="forgot-password">
              <button onClick={() => setForgotPassword(true)}>{t("login-register.forgot-password")}</button>
            </div>

            <TermUse />
          </div>
        ) : (
          <ForgotPassword onForgotPassword={() => setForgotPassword(false)} />
        )}
      </div>

      {backHomePage && <Loading />}
    </div>
  );
};

export default Login;

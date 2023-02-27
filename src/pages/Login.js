import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import { BsFacebook } from "react-icons/bs";
import { Form, Input } from "antd";
import { isValidEmail } from "../utils/helpers";
import { handleChangePathSystem } from "../slices/appSlice";
import { login } from "../slices/userSlice";
import "../styles/Login.scss";
import "../styles/CustomForm.scss";

const initialState = {
  errorMessage: "",
  email: "",
  password: "",
};

const Login = () => {
  const [state, setState] = useState({ ...initialState });
  const { isLoggedIn, userInfo } = useSelector((store) => store.user);
  const dispatch = useDispatch();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (userInfo.roleId === "R1") {
        navigate("/admin-system");
        dispatch(handleChangePathSystem("/admin-system"));
      } else {
        navigate("/doctor-system");
        dispatch(handleChangePathSystem("/doctor-system"));
      }
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login-background">
      <div className="back-home">
        <button className="back-home-link" onClick={() => navigate("/")}>
          <BiArrowBack />
          Về Trang chủ
        </button>
      </div>

      <div className="login-container">
        <div className="login-content ">
          <div className="title">Đăng nhập</div>

          <div className="auth-social">
            <button className="auth-google">
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

            <button className="auth-facebook">
              <div className="icon">
                <BsFacebook />
              </div>
              <span>Facebook</span>
            </button>
          </div>

          <div className="or">hoặc</div>

          <Form
            className="form-login"
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
                      return Promise.reject("Vui lòng nhập Email");
                    }
                    return isValidEmail(value)
                      ? Promise.resolve()
                      : Promise.reject("Email không hợp lệ. Vui lòng kiểm tra lại");
                  },
                },
              ]}
            >
              <Input
                // ref={inputEmailRef}
                type="text"
                name="email"
                prefix={
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="user"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    value={state.email}
                  >
                    <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                  </svg>
                }
                placeholder="Email"
                className="customInput"
                // autoFocus
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value?.length) {
                      return Promise.reject("Mật khẩu không được bỏ trống");
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
                placeholder="Mật khẩu"
                className="customInput"
                // autoFocus
              />
            </Form.Item>

            {state.errorMessage && <div className="error-text">{state.errorMessage}</div>}

            <div className="forgot-password">
              <Link to="/login/forgot-password">Quên mật khẩu</Link>
            </div>

            <button className="form-button button button-main">Đăng nhập</button>
          </Form>

          <div className="no-account">
            <span>Bạn không có tài khoản? </span>
            <Link to="/register">Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

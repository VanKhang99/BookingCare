import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ResetPassword, TermUse, Loading } from "../components";
import { Form, Input } from "antd";
import { AiOutlineMail, AiOutlineNumber } from "react-icons/ai";
import { IoChevronBack } from "react-icons/io5";
import { forgotPassword, verifyCode } from "../slices/userSlice";
import { isValidEmail } from "../utils/helpers";
import {
  INTERVAL_COUNTDOWN,
  EXPIRES_FORGOT_PASSWORD_COUNTDOWN,
  EXPIRES_FORGOT_PASSWORD_CONFIRM_CODE,
  TIMEOUT_NAVIGATE,
} from "../utils/constants";
import "../styles/ForgotPassword.scss";

const initialState = {
  email: "",
  confirmCode: "",

  gotVerifyCode: false,
  timeStampWhenGettingCode: "",
};

const ForgotPassword = ({ onForgotPassword }) => {
  const [stateFP, setStateFP] = useState(initialState);
  const [disableButtonConfirm, setDisableButtonConfirm] = useState(true);
  const [disableButtonSendCode, setDisableButtonSendCode] = useState(true);
  const [countdownStart, setCountdownStart] = useState(false);
  const [countdown, setCountdown] = useState(EXPIRES_FORGOT_PASSWORD_COUNTDOWN);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [toResetPassword, setToResetPassword] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { isGettingCodeForgotPassword } = useSelector((store) => store.user);

  const handleEmailChange = (e) => {
    const disableButton = isValidEmail(e.target.value) ? false : true;

    // CASE: current email got coded but see email wrong => re-set some values
    if (countdownStart && stateFP.gotVerifyCode) {
      setStateFP({ ...stateFP, gotVerifyCode: false });
      setCountdownStart(false);
      setCountdown(EXPIRES_FORGOT_PASSWORD_COUNTDOWN);
      setDisableButtonSendCode(disableButton);
      return;
    }

    setStateFP({ ...stateFP, email: e.target.value });
    setDisableButtonSendCode(disableButton);
    setDisableButtonConfirm((disableButton && stateFP.confirmCode.length) === 7 ? false : true);
  };

  const handleInputConfirmCode = (e) => {
    //CASE: countdownStart don't start and not got code => input field code can not change
    if (!countdownStart && !stateFP.gotVerifyCode) return;

    const value = e.target.value;
    let disableButton = true;

    //CASE: input field code only have 7 numbers and got coded => button sign up is available
    // if get code => run function handleSendCode
    if (value.length <= 7) {
      disableButton = stateFP.gotVerifyCode && value.length === 7 ? false : true;
      setStateFP({ ...stateFP, confirmCode: value });
    } else {
      return;
    }
    setDisableButtonConfirm(disableButton);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (disableButtonSendCode) return;

    try {
      const result = await dispatch(
        forgotPassword({
          email: stateFP.email,
          language,
        })
      );

      if (result.payload?.status === "error") {
        return toast.error(
          language === "vi" ? "Email chưa đăng ký tài khoản. Vui lòng kiểm tra lại!" : result.payload.message
        );
      }

      if (result.payload?.status === "success") {
        const timeStampWhenGettingCode = Date.now();
        setStateFP({
          ...stateFP,
          timeStampWhenGettingCode,
          gotVerifyCode: true,
        });
        setCountdownStart(true);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const timeStampWhenPressConfirm = Date.now();
      const codeIsExpired =
        timeStampWhenPressConfirm - stateFP.timeStampWhenGettingCode > EXPIRES_FORGOT_PASSWORD_CONFIRM_CODE;

      if (codeIsExpired) {
        return toast.error(
          language === "vi"
            ? "Mã xác nhận tài khoản đã hết hiệu lực. Xin vui lòng lấy mã khác!"
            : "The account verification code has expired. Please get another code!"
        );
      }

      const resultVerifyCode = await dispatch(
        verifyCode({ email: stateFP.email, confirmCode: stateFP.confirmCode })
      );

      if (!resultVerifyCode.payload || resultVerifyCode.payload.status !== "success") {
        return toast.error(
          language === "vi"
            ? "Mã xác nhận hoặc email bạn cung cấp không đúng. Vui lòng kiểm tra lại!"
            : "The verification code or email you provided is incorrect. Please check again!"
        );
      }

      setToResetPassword(true);
      setTimeout(async () => {
        setShowResetPassword(true);
      }, TIMEOUT_NAVIGATE);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisplayButtonSendCode = () => {
    if (countdownStart) {
      return <>{`${t("button.resend-code")} ${countdown}`}</>;
    }

    return (
      <>
        {!isGettingCodeForgotPassword ? (
          t("button.send-code")
        ) : (
          <>
            <Loading notAllScreen={true} smallLoading={true} />
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    let timerId;
    if (countdownStart) {
      if (countdown === EXPIRES_FORGOT_PASSWORD_COUNTDOWN) {
        setDisableButtonSendCode(true);
      }

      timerId = setInterval(() => {
        setCountdown((prevState) => {
          if (prevState === 0) {
            setStateFP((prevState) => {
              const newState = {
                ...prevState,
                gotVerifyCode: true,
                confirmCode: prevState.confirmCode,
              };
              return newState;
            });
            setCountdownStart(false);
            setDisableButtonSendCode(false);
            return EXPIRES_FORGOT_PASSWORD_COUNTDOWN;
          }

          setDisableButtonSendCode(true);
          return prevState - 1;
        });
      }, [INTERVAL_COUNTDOWN]);
      // INTERVAL_COUNTDOWN
    }
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdownStart]);

  return (
    <>
      {!showResetPassword ? (
        <div className="forgot-password">
          <div className="forgot-password__go-back" onClick={onForgotPassword}>
            <IoChevronBack />
          </div>

          <div className="forgot-password__title">{t("password.password-retrieval")}</div>

          <Form className="form form--forgot-password">
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
                type="text"
                name="email"
                onChange={handleEmailChange}
                prefix={<AiOutlineMail style={{ marginTop: "1px" }} />}
                placeholder="Email"
                className="custom-input"
                autoFocus
              />
            </Form.Item>

            <div className="form-confirm-code">
              <Form.Item
                className="form-confirm-code__input"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value.length !== 7) {
                        return Promise.reject(t("password.valid-verification-code"));
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  value={stateFP.confirmCode}
                  prefix={<AiOutlineNumber />}
                  placeholder={t("password.verification-code")}
                  className="custom-input"
                  maxLength="7"
                  onChange={handleInputConfirmCode}
                />

                <button
                  className={`form-button form-button--send-code ${
                    disableButtonSendCode ? "form-button--send-code-disable" : "form-button--send-code"
                  }`}
                  style={{ width: countdownStart ? "20.8rem" : "13rem" }}
                  onClick={(e) => handleSendCode(e)}
                >
                  {handleDisplayButtonSendCode()}
                </button>
              </Form.Item>
            </div>

            <button
              className={`form-button ${
                !disableButtonConfirm
                  ? "form-button--confirm"
                  : "form-button--confirm form-button--confirm-disable"
              }`}
              onClick={(e) => handleConfirm(e)}
              disabled={disableButtonConfirm}
            >
              <span>{t("button.confirm")}</span>
            </button>
          </Form>

          <TermUse />

          {toResetPassword && <Loading />}
        </div>
      ) : (
        <ResetPassword
          onShowResetPassword={() => setShowResetPassword(false)}
          email={stateFP.email}
          confirmCode={stateFP.confirmCode}
        />
      )}
    </>
  );
};

export default ForgotPassword;

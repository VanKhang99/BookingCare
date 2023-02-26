import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateDataUser } from "../../slices/userSlice";
import { getAllCodes } from "../../slices/allcodeSlice";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { isValidEmail, isValidPhone, toBase64, checkData } from "../../utils/helpers";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "../styles/FormUser.scss";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  gender: "",
  positionId: "",
  roleId: "",

  image: "",
  fileImage: "",
  previewImgUrl: "",
  isOpenImagePreview: false,

  errorInput: {
    show: false,
    message: "",
  },

  action: "create",
};

const FormUser = ({ dataUserEdit, handleGetAllUsers, roleToFilter, total }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { genderArr, positionArr, roleArr } = useSelector((store) => store.allcode);

  const handleInputChange = (e, id) => {
    let stateCopy = { ...state };
    stateCopy[id] = e.target.value;
    setState({ ...stateCopy });
  };

  const handleOnChangeImage = async (e) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      // const fileCovert = await toBase64(file);

      return setState({
        ...state,
        fileImage: file,
        image: state.image || file.name,
        previewImageUrl: objectURL,
      });
    }
  };

  const handleOpenImagePreview = () => {
    if (!state.previewImgUrl) return;

    setState({ ...state, isOpenImagePreview: true });
  };

  const handleCreateOrUpdateUser = async () => {
    setState({ ...state, errorInput: { show: false, message: "" } });

    const propsCheckKey =
      state.action === "create"
        ? ["email", "password", "firstName", "lastName", "address", "phoneNumber"]
        : ["firstName", "lastName", "address", "phoneNumber"];

    const validateInput = checkData(state, propsCheckKey);
    if (!validateInput) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: `Input field cannot be empty. Please fill out the form!`,
        },
      });
      return;
    }

    if (!isValidEmail(state.email)) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: "Invalid Email. Please try another email!",
        },
      });
      return;
    }

    if (!isValidPhone(state.phoneNumber)) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: "Phone must have 10 numbers. Please try again!",
        },
      });
      return;
    }

    try {
      let res;
      if (state.action && state.action === "edit") {
        res = await dispatch(
          updateDataUser({
            id: dataUserEdit.id,
            user: {
              email: state.email,
              firstName: state.firstName,
              lastName: state.lastName,
              address: state.address,
              phoneNumber: state.phoneNumber,
              image: state.image,
              gender: state.gender,
              positionId: state.positionId,
              roleId: state.roleId,
            },
          })
        );
        toast.success("Successfully updated!");
      } else {
        res = await dispatch(createUser(state));
        if (res.payload?.status === "error") {
          toast.error("User creation failed!");

          return setState({
            ...state,
            errorInput: {
              show: true,
              message: `${res.payload.message}`,
            },
          });
        }

        toast.success("Create user successfully!");
      }

      await handleGetAllUsers(roleToFilter, total + 1);
      setState({
        ...initialState,
        gender: genderArr[0].keyMap,
        positionId: positionArr[0].keyMap,
        roleId: roleArr[0].keyMap,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCodes("GENDER"));
    dispatch(getAllCodes("POSITION"));
    dispatch(getAllCodes("ROLE"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (genderArr?.length > 0) {
      setState((prevState) => {
        return { ...prevState, gender: genderArr[0].keyMap };
      });
    }

    if (positionArr?.length > 0) {
      setState((prevState) => {
        return { ...prevState, positionId: positionArr[0].keyMap };
      });
    }

    if (roleArr?.length > 0) {
      setState((prevState) => {
        return { ...prevState, roleId: roleArr[0].keyMap };
      });
    }
  }, [genderArr, positionArr, roleArr]);

  useEffect(() => {
    if (!state.previewImgUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImgUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image]);

  useEffect(() => {
    if (dataUserEdit) {
      setState({
        ...state,
        email: dataUserEdit.email,
        firstName: dataUserEdit.firstName,
        lastName: dataUserEdit.lastName,
        address: dataUserEdit.address,
        gender: dataUserEdit.gender,
        phoneNumber: dataUserEdit.phoneNumber,
        image: dataUserEdit.image ?? "",
        positionId: dataUserEdit.positionId ?? "",
        roleId: dataUserEdit.roleId ?? "",
        action: "edit",
        previewImgUrl: dataUserEdit.image ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUserEdit]);

  return (
    <div className="form-user container">
      <h3 className="u-sub-title my-4 d-flex justify-content-between">
        {state.action ? t("user-manage.update-user") : t("user-manage.create-user")}
        <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
          <IoReload />
        </button>
      </h3>

      <Form className="form-user-inputs">
        <div className="row">
          <Form.Group className="mb-4 col-6" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              autoFocus
              value={state.email}
              disabled={state.action ? true : false}
              onChange={(e, id) => handleInputChange(e, "email")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={state.password}
              disabled={state.action ? true : false}
              onChange={(e, id) => handleInputChange(e, "password")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formFirstName">
            <Form.Label>{t("user-manage.first-name")}</Form.Label>
            <Form.Control
              type="text"
              value={state.firstName}
              onChange={(e, id) => handleInputChange(e, "firstName")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formLastName">
            <Form.Label>{t("user-manage.last-name")}</Form.Label>
            <Form.Control
              type="text"
              value={state.lastName}
              onChange={(e, id) => handleInputChange(e, "lastName")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formAddress">
            <Form.Label>{t("user-manage.address")}</Form.Label>
            <Form.Control
              type="text"
              value={state.address}
              onChange={(e, id) => handleInputChange(e, "address")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formPhone">
            <Form.Label>{t("user-manage.phone")}</Form.Label>
            <Form.Control
              type="text"
              value={state.phoneNumber}
              onChange={(e, id) => handleInputChange(e, "phoneNumber")}
            />
          </Form.Group>
        </div>
        <div className="row">
          <div className="col-6">
            <Form.Group className="mb-4 col-12" controlId="formGender">
              <Form.Label>{t("user-manage.gender")}</Form.Label>
              <Form.Select value={state.gender} onChange={(e, id) => handleInputChange(e, "gender")}>
                {genderArr &&
                  genderArr.length > 0 &&
                  genderArr.map((gender, index) => {
                    return (
                      <option key={gender.keyMap} value={gender.keyMap}>
                        {language === "vi" ? gender.valueVi : gender.valueEn}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4 col-12" controlId="formPosition">
              <Form.Label>{t("user-manage.position")}</Form.Label>
              <Form.Select value={state.positionId} onChange={(e, id) => handleInputChange(e, "positionId")}>
                {positionArr &&
                  positionArr.length > 0 &&
                  positionArr.map((position, index) => {
                    return (
                      <option key={position.keyMap} value={position.keyMap}>
                        {language === "vi" ? position.valueVi : position.valueEn}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="col-12" controlId="formRole">
              <Form.Label>{t("user-manage.role")}</Form.Label>
              <Form.Select value={state.roleId} onChange={(e, id) => handleInputChange(e, "roleId")}>
                {roleArr &&
                  roleArr.length > 0 &&
                  roleArr.map((role, index) => {
                    return (
                      <option key={role.keyMap} value={role.keyMap}>
                        {language === "vi" ? role.valueVi : role.valueEn}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group className="col-12  image-preview-container" controlId="formImage">
              <label htmlFor="image" className="form-label">
                {t("user-manage.image")}
              </label>
              <input
                type="file"
                id="image"
                className="form-control"
                onChange={(e) => handleOnChangeImage(e)}
                hidden
              />

              <div className="col-12 input-image-customize">
                <label htmlFor="image">
                  <FaUpload /> {t("button.upload")}
                </label>
              </div>

              <div
                className={`col-12  ${
                  state.previewImgUrl ? "image-preview large open" : "image-preview large"
                }`}
                onClick={handleOpenImagePreview}
                style={{
                  backgroundImage: `url(${state.previewImgUrl ? state.previewImgUrl : ""})`,
                }}
              ></div>
            </Form.Group>
          </div>

          {state.errorInput.show && (
            <div className="col-12 form-user-inputs__error">
              {state.errorInput.show && state.errorInput.message}
            </div>
          )}
        </div>

        <div className="row">
          <div className="u-system-button mt-4 text-end">
            <Button variant="primary" onClick={handleCreateOrUpdateUser}>
              {state.action ? t("button.update") : t("button.create")}
            </Button>
          </div>
        </div>
      </Form>

      {state.isOpenImagePreview && (
        <Lightbox
          mainSrc={state.previewImgUrl}
          onCloseRequest={() => setState({ ...state, isOpenImagePreview: false })}
        />
      )}
    </div>
  );
};

export default FormUser;

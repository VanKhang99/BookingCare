import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, createUser, updateDataUser } from "../../slices/systemReduxSlice";
import { getAllCode } from "../../slices/allcodeSlice";
import { FaUpload } from "react-icons/fa";
import { isValidEmail, isValidPhone, toBase64 } from "../../utils/helpers";
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

  errorInput: {
    show: false,
    message: "",
  },
  imageName: "",
  previewImgUrl: "",
  isOpenImagePreview: false,
  action: "",
};

const FormUser = ({ dataUserEdit }) => {
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
      const fileCovert = await toBase64(file);
      return setState({
        ...state,
        image: fileCovert,
        imageName: file.name,
        previewImgUrl: objectURL,
      });
    }
  };

  const handleOpenImagePreview = () => {
    if (!state.previewImgUrl) return;

    setState({ ...state, isOpenImagePreview: true });
  };

  const checkValidateInput = () => {
    let isValid = true;
    let arrInput = !state.action
      ? ["email", "password", "firstName", "lastName", "address", "phoneNumber"]
      : ["firstName", "lastName", "address", "phoneNumber"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!state[arrInput[i]]) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const handleCreateOrUpdateUser = async () => {
    setState({ ...state, errorInput: { show: false, message: "" } });

    const resultCheckInput = checkValidateInput();
    if (!resultCheckInput) {
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
      if (state.action && state.action === "editing") {
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
              imageName: state.imageName,
            },
          })
        );
        toast.success("Successfully updated!");
      } else {
        console.log(state);
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

      await dispatch(getAllUsers());
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
    dispatch(getAllCode("GENDER"));
    dispatch(getAllCode("POSITION"));
    dispatch(getAllCode("ROLE"));
  }, []);

  useEffect(() => {
    if (genderArr && genderArr.length > 0) {
      setState((prevState) => {
        return { ...prevState, gender: genderArr[0].keyMap };
      });
    }

    if (positionArr && positionArr.length > 0) {
      setState((prevState) => {
        return { ...prevState, positionId: positionArr[0].keyMap };
      });
    }

    if (roleArr && roleArr.length > 0) {
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
  }, [state.image]);

  useEffect(() => {
    if (dataUserEdit) {
      const buff = new Buffer(dataUserEdit.image ? dataUserEdit.image : "", "base64");
      const imageBase64 = buff.toString("binary");

      setState({
        ...state,
        email: dataUserEdit.email,
        firstName: dataUserEdit.firstName,
        lastName: dataUserEdit.lastName,
        address: dataUserEdit.address,
        gender: dataUserEdit.gender,
        phoneNumber: dataUserEdit.phoneNumber,
        image: dataUserEdit.image,
        positionId: dataUserEdit.positionId,
        roleId: dataUserEdit.roleId,
        action: "editing",
        previewImgUrl: imageBase64,
        imageName: dataUserEdit.imageName,
      });
    }
  }, [dataUserEdit]);

  return (
    <div className="form-user container">
      <h3 className="form-user-title my-4">
        {state.action ? t("user-redux.update") : t("user-redux.create")}
      </h3>

      <Form className="form-user">
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
            <Form.Label>{t("user-redux.password")}</Form.Label>
            <Form.Control
              type="password"
              value={state.password}
              disabled={state.action ? true : false}
              onChange={(e, id) => handleInputChange(e, "password")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formFirstName">
            <Form.Label>{t("user-redux.first-name")}</Form.Label>
            <Form.Control
              type="text"
              value={state.firstName}
              onChange={(e, id) => handleInputChange(e, "firstName")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formLastName">
            <Form.Label>{t("user-redux.last-name")}</Form.Label>
            <Form.Control
              type="text"
              value={state.lastName}
              onChange={(e, id) => handleInputChange(e, "lastName")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formAddress">
            <Form.Label>{t("user-redux.address")}</Form.Label>
            <Form.Control
              type="text"
              value={state.address}
              onChange={(e, id) => handleInputChange(e, "address")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formPhone">
            <Form.Label>{t("user-redux.phone")}</Form.Label>
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
              <Form.Label>{t("user-redux.gender")}</Form.Label>
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
              <Form.Label>{t("user-redux.position")}</Form.Label>
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
              <Form.Label>{t("user-redux.role")}</Form.Label>
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
                {t("user-redux.image")}
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
                  <FaUpload /> {t("user-redux.upload")}
                </label>

                <div className="image-name">{state.imageName ? state.imageName : ""}</div>
              </div>

              <div
                className={`col-12  ${state.previewImgUrl ? "image-preview open" : "image-preview"}`}
                onClick={handleOpenImagePreview}
                style={{
                  backgroundImage: `url(${state.previewImgUrl ? state.previewImgUrl : ""})`,
                }}
              ></div>
            </Form.Group>
          </div>

          {state.errorInput.show && (
            <div className="col-12 error-input">{state.errorInput.show && state.errorInput.message}</div>
          )}
        </div>

        <div className="row">
          <div className="form-user-button mt-4 text-end">
            <Button variant="primary" onClick={handleCreateOrUpdateUser}>
              {state.action ? t("user-redux.button-update") : t("user-redux.button-create")}
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

// if (!isValidPassword(state.password)) {
//   isValid = false;
//   setState({
//     ...state,
//     errorInput: {
//       show: true,
//       message:
//         "Invalid password. Password must have 1 uppercase, 1 special character, 1 number and must be eight characters or longer. Please try another password!",
//     },
//   });
//   return isValid;
// }

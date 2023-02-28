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
import { isValidEmail, isValidPhone, checkData, postImageToS3, deleteImageOnS3 } from "../../utils/helpers";
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
  previewImageUrl: "",
  isOpenImagePreview: false,

  errorInput: {
    show: false,
    message: "",
  },

  action: "create",
};

const FormUser = ({ dataUserEdit, handleGetAllUsers, roleToFilter, total, onResetState }) => {
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
    if (!state.previewImageUrl) return;

    setState({ ...state, isOpenImagePreview: true });
  };

  const checkInput = (dataInput, propsCheck) => {
    const validateInput = checkData(dataInput, propsCheck);
    if (!validateInput) {
      return setState({
        ...state,
        errorInput: {
          show: true,
          message: `Input field cannot be empty. Please fill out the form!`,
        },
      });
    }
  };

  const checkEmail = (email) => {
    if (!isValidEmail(email)) {
      return setState({
        ...state,
        errorInput: {
          show: true,
          message: "Invalid Email. Please try another email!",
        },
      });
    }
  };

  const checkPhone = (phone) => {
    if (!isValidPhone(phone)) {
      return setState({
        ...state,
        errorInput: {
          show: true,
          message: "Phone must have 10 numbers. Please try again!",
        },
      });
    }
  };

  const handleSaveDataUser = async () => {
    setState({ ...state, errorInput: { show: false, message: "" } });

    const propsCheckKey =
      state.action === "create"
        ? ["email", "password", "firstName", "lastName", "address", "phoneNumber"]
        : ["firstName", "lastName", "address", "phoneNumber"];

    checkInput(state, propsCheckKey);
    checkEmail(state.email);
    checkPhone(state.phoneNumber);

    try {
      let res, imageUploadToS3;
      if (typeof state.fileImage !== "string") {
        if (state.action === "edit") {
          // Delete old image before update new image
          res = await handleUpdateUser(imageUploadToS3);
          if (res.payload.status !== "success")
            return toast.error("User data is updated fail. Please try again!");

          toast.success("User data is updated successfully!");
          return handleResetState();
        }

        imageUploadToS3 = await postImageToS3(state.fileImage);
      }

      res = await dispatch(
        createUser({ ...state, image: imageUploadToS3?.data?.data?.image || state.image })
      );
      if (res.payload.status === "error") {
        toast.error("User creation failed!");

        return setState({
          ...state,
          errorInput: {
            show: true,
            message: `${res.payload.message}`,
          },
        });
      }

      toast.success("User created successfully!");
      await handleGetAllUsers(roleToFilter, total + 1);
      return handleResetState();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUser = async (imageUploadToS3) => {
    try {
      await deleteImageOnS3(state.image);
      imageUploadToS3 = await postImageToS3(state.fileImage);
      const userDataSendServer = {
        ...state,
        id: +dataUserEdit?.id,
        image: imageUploadToS3?.data?.data?.image || state.image,
      };

      const res = await dispatch(updateDataUser(userDataSendServer));
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetState = () => {
    onResetState();
    return setState({
      ...initialState,
      gender: genderArr[0].keyMap,
      positionId: positionArr[0].keyMap,
      roleId: roleArr[0].keyMap,
    });
  };

  useEffect(() => {
    dispatch(getAllCodes("GENDER"));
    dispatch(getAllCodes("POSITION"));
    dispatch(getAllCodes("ROLE"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        previewImageUrl: dataUserEdit.imageUrl ?? "",
        action: "edit",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUserEdit]);

  useEffect(() => {
    if (!state.previewImageUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image]);

  useEffect(() => {
    if (genderArr?.length > 0) {
      setState({ ...state, gender: genderArr[0].keyMap });
    }

    if (positionArr?.length > 0) {
      setState({ ...state, positionId: positionArr[0].keyMap });
    }

    if (roleArr?.length > 0) {
      setState({ ...state, roleId: roleArr[0].keyMap });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderArr, positionArr, roleArr]);

  // console.log(state);

  return (
    <div className="form-user container">
      <h3 className="u-sub-title my-4 d-flex justify-content-between">
        {state.action ? t("user-manage.update-user") : t("user-manage.create-user")}
        <button className="u-system-button--refresh-data" onClick={handleResetState}>
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
              disabled={state.action === "edit" ? true : false}
              onChange={(e, id) => handleInputChange(e, "email")}
            />
          </Form.Group>

          <Form.Group className="mb-4 col-6" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={state.password}
              disabled={state.action === "edit" ? true : false}
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
              <label htmlFor="image" className="u-input-label">
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
                  state.previewImageUrl ? "image-preview large open" : "image-preview large"
                }`}
                onClick={() => handleOpenImagePreview()}
                style={{
                  backgroundImage: `url(${state.previewImageUrl ? state.previewImageUrl : ""})`,
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
            <Button variant="primary" onClick={handleSaveDataUser}>
              {state.action === "edit" ? t("button.update") : t("button.create")}
            </Button>
          </div>
        </div>
      </Form>

      {state.isOpenImagePreview && (
        <Lightbox
          mainSrc={state.previewImageUrl}
          onCloseRequest={() => setState({ ...state, isOpenImagePreview: false })}
        />
      )}
    </div>
  );
};

export default FormUser;

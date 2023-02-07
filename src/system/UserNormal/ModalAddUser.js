import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../styles/Modal.scss";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  gender: "0",
  roleId: "1",

  errorInput: {
    show: false,
    message: "",
  },
};

const ModalAddUser = ({ show, onHide, createNewUser }) => {
  const [state, setState] = useState({ ...initialState });

  const handleHideModal = () => {
    onHide();
    setState({ ...initialState });
  };

  const handleInputChange = (e, id) => {
    const stateCopy = { ...state };
    stateCopy[id] = e.target.value;
    setState({ ...stateCopy });
  };

  const checkValidateInput = () => {
    let isValid = true;
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      "address",
      "phoneNumber",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!state[arrInput[i]]) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const handleAddUser = async () => {
    setState({ ...state, errorInput: { show: false, message: "" } });

    const result = checkValidateInput();
    if (!result) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: `Input field cannot be empty. Please fill out the form!`,
        },
      });
      return;
    }

    try {
      const resultCreateUser = await createNewUser(state);
      if (resultCreateUser.haveError) {
        return setState({
          ...state,
          errorInput: { show: true, message: `${resultCreateUser.message}` },
        });
      }

      onHide();
      setState({ ...initialState });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => handleHideModal()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="top">
        <div className="title">CREATE NEW USER</div>
        <span className="icon-close" onClick={() => this.handleHideModal()}>
          <i className="fas fa-times"></i>
        </span>
      </Modal.Header>
      <Modal.Body>
        <Form className="form-user">
          <div className="row">
            <Form.Group className="mb-3 col-6" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                autoFocus
                value={state.email}
                onChange={(e, id) => handleInputChange(e, "email")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-6" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={state.password}
                onChange={(e, id) => handleInputChange(e, "password")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-6" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={state.firstName}
                onChange={(e, id) => handleInputChange(e, "firstName")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-6" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={state.lastName}
                onChange={(e, id) => handleInputChange(e, "lastName")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-12" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={state.address}
                onChange={(e, id) => handleInputChange(e, "address")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-6" controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={state.phoneNumber}
                onChange={(e, id) => handleInputChange(e, "phoneNumber")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-3" controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={state.gender}
                onChange={(e, id) => handleInputChange(e, "gender")}
              >
                <option value="0">Male</option>
                <option value="1">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={state.roleId}
                onChange={(e, id) => handleInputChange(e, "role")}
              >
                <option value="1">Admin</option>
                <option value="2">Doctor</option>
                <option value="3">Patient</option>
              </Form.Select>
            </Form.Group>

            <div className="col-12 error-input">
              {state.errorInput.show && state.errorInput.message}
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-actions">
        <Button variant="secondary" onClick={() => handleHideModal()}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleAddUser()}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddUser;

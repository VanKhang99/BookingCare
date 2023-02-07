import React, { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createAllCode } from "../slices/allcodeSlice";
import { checkData } from "../utils/helpers";
import "./styles/CRUDAllcodeModel.scss";

const initialState = {
  keyMap: "",
  type: "",
  valueEn: "",
  valueVi: "",
};

const CRUDAllcodeModel = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const keyMapRef = useRef(null);

  const handleInputChange = (e, type) => {
    const stateCopy = { ...state };
    stateCopy[type] = e.target.value;
    return setState({ ...stateCopy });
  };

  const handleSaveDataAllCode = async () => {
    try {
      const propsKeyArr = Object.keys(state);
      console.log(propsKeyArr);
      const validateInputs = checkData(state, propsKeyArr);

      if (!validateInputs) throw new Error("Please fill out all fields!");

      const res = await dispatch(createAllCode(state));

      console.log(res);

      if (res?.payload?.status === "success") {
        setState({ ...initialState });
        keyMapRef.current.focus();
        toast.success("All-code data has been created into all-code table successfully!");
        return;
      } else if (res?.payload?.status === "error") {
        throw new Error(res.payload.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    keyMapRef.current.focus();
  }, []);

  return (
    <div className="allcode container">
      <div className="allcode-content">
        <div className="allcode-content__title mt-3 text-center">CRUD ALLCODE</div>
        <div className="allcode-inputs">
          <div className="row">
            <Form.Group className="mt-5 col-6" controlId="formKeyMap">
              <Form.Label className="allcode-inputs__label">Key Map</Form.Label>
              <Form.Control
                ref={keyMapRef}
                type="text"
                value={state.keyMap}
                onChange={(e, id) => handleInputChange(e, "keyMap")}
              />
            </Form.Group>

            <Form.Group className="mt-5 col-6" controlId="formType">
              <Form.Label className="allcode-inputs__label">Type</Form.Label>
              <Form.Control
                type="text"
                value={state.type}
                onChange={(e, id) => handleInputChange(e, "type")}
              />
            </Form.Group>

            <Form.Group className="mt-5 col-6" controlId="formValueEn">
              <Form.Label className="allcode-inputs__label">Value En</Form.Label>
              <Form.Control
                type="text"
                value={state.valueEn}
                onChange={(e, id) => handleInputChange(e, "valueEn")}
              />
            </Form.Group>

            <Form.Group className="mt-5 col-6" controlId="formValueVi">
              <Form.Label className="allcode-inputs__label">Value Vi</Form.Label>
              <Form.Control
                type="text"
                value={state.valueVi}
                onChange={(e, id) => handleInputChange(e, "valueVi")}
              />
            </Form.Group>
          </div>

          <div className="allcode-inputs__button mt-5 text-end">
            <Button variant="primary" onClick={() => handleSaveDataAllCode()}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRUDAllcodeModel;

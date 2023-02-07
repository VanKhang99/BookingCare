import React, { useState } from "react";
import { FormUser, ListUser } from "../index";

import "../styles/UserRedux.scss";

const UserRedux = () => {
  const [dataUserEdit, setDataUserEdit] = useState(null);

  const handleEditDataUser = (isEdit, user) => {
    setDataUserEdit((prevState) => {
      return { ...prevState, ...user };
    });
  };

  return (
    <div className="user-redux-container">
      <div className="user-redux-content">
        <div className="user-redux">
          <div className="user-redux-title text-center mt-3">
            CRUD users with Redux
          </div>

          <FormUser dataUserEdit={dataUserEdit ? dataUserEdit : null} />
          <ListUser handleEditDataUser={handleEditDataUser} />
        </div>
      </div>
    </div>
  );
};

export default UserRedux;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { TableList } from "../index";
import { getAllUsers, deleteUser } from "../../slices/systemReduxSlice";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/UserManage.scss";
import "../styles/ListUser.scss";

const ListUser = ({ handleEditDataUser }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((store) => store.systemRedux);
  const { t } = useTranslation();

  const handleDeleteUser = async (id) => {
    try {
      await dispatch(deleteUser(id));
      toast.success("Delete user successfully!");
      await dispatch(getAllUsers());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [users.length]);

  return (
    <div className="list-user-wrapper">
      <div className="list-user-content">
        <div className="list-user container">
          <h3 className="list-user-title">{t("user-redux.list-users")}</h3>

          <TableList
            users={users.length > 0 ? users : []}
            redux
            onEditUserData={handleEditDataUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ListUser;

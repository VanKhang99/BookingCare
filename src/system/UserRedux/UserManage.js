import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FormUser, ListUser } from "../index";
import { getAllUsers, deleteUser } from "../../slices/systemReduxSlice";
import "../styles/UserManage.scss";

const initialState = {
  usersFromServer: [],
  totalUsers: null,
  rolesUser: [],
  dataUserEdit: null,
  page: 1,
  limit: 8,

  roleToFilter: "",
};

const UserManage = () => {
  const [state, setState] = useState({ ...initialState });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleGetAllUsers = async (role, totalUsers) => {
    try {
      let res;
      if (totalUsers > state.limit || totalUsers === null) {
        res = await dispatch(getAllUsers({ page: state.page, limit: state.limit, role }));
      } else {
        res = await dispatch(getAllUsers({ page: "", limit: "", role }));
      }

      if (res?.payload?.users.length > 0) {
        const dataRoleTotalUsers = [...new Set(res.payload.countUsers.users.map((user) => user.roleId))];

        return setState({
          ...state,
          usersFromServer: [...res.payload.users],
          totalUsers: totalUsers ? totalUsers : res.payload.countUsers.count,
          rolesUser: dataRoleTotalUsers,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    return setState({ ...state, page });
  };

  const handleEditDataUser = (isEdit, user) => {
    setState((prevState) => {
      return { ...state, dataUserEdit: { ...prevState.dataUserEdit, ...user } };
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      await dispatch(deleteUser(id));
      toast.success("Delete user successfully!");
      await handleGetAllUsers(state.roleToFilter, state.totalUsers - 1, "delete");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterUsers = (totalUsers, newUsersArr, roleToFilter) => {
    return setState({ ...state, totalUsers, users: [...newUsersArr], roleToFilter, page: 1 });
  };

  useEffect(() => {
    handleGetAllUsers(state.roleToFilter, state.totalUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.totalUsers, state.page, state.limit]);

  return (
    <div className="user-redux-container">
      <div className="user-redux-content">
        <div className="user-redux">
          <div className="user-redux-title text-center mt-3">{t("menu-system.user-management")}</div>

          <FormUser
            dataUserEdit={state.dataUserEdit ? state.dataUserEdit : ""}
            handleGetAllUsers={handleGetAllUsers}
            total={state.totalUsers ? state.totalUsers : ""}
            roleToFilter={state.roleToFilter}
          />
          <ListUser
            users={state.usersFromServer.length ? state.usersFromServer : []}
            total={state.totalUsers ? state.totalUsers : ""}
            page={state.page}
            limit={state.limit}
            rolesUser={state.rolesUser}
            onEditDataUser={handleEditDataUser}
            onPageChange={handlePageChange}
            onDeleteUser={handleDeleteUser}
            onFilterUsers={handleFilterUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManage;

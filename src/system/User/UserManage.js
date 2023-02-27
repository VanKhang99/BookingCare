import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FormUser, ListUser } from "../index";
import { getAllUsers, getUser, deleteUser } from "../../slices/userSlice";
import { deleteImageOnS3 } from "../../utils/helpers";

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

      if (res?.payload?.users?.length > 0) {
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

  const handleFilterUsers = (totalUsers, newUsersArr, roleToFilter) => {
    return setState({ ...state, totalUsers, users: [...newUsersArr], roleToFilter, page: 1 });
  };

  const handleEditDataUser = async (isEdit, id) => {
    try {
      const res = await dispatch(getUser(+id));
      const userData = res.payload.data;
      return setState({ ...state, dataUserEdit: userData });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      alert("Are you sure you want to delete?");
      if (user.image) {
        await deleteImageOnS3(user.image);
      }

      const res = await dispatch(deleteUser(user.id));

      if (res.payload === "") {
        toast.success("User is deleted successfully!");
        await handleGetAllUsers(state.roleToFilter, state.totalUsers - 1, "delete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetState = () => {
    return setState({ ...state, dataUserEdit: null });
  };

  useEffect(() => {
    handleGetAllUsers(state.roleToFilter, state.totalUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.totalUsers, state.page, state.limit]);

  return (
    <div className="user-manage container" style={{ padding: "0 3rem", marginBottom: "4rem" }}>
      <div className="u-main-title text-center mt-3">{t("menu-system.user-management")}</div>

      <FormUser
        dataUserEdit={state.dataUserEdit ? state.dataUserEdit : ""}
        handleGetAllUsers={handleGetAllUsers}
        total={state.totalUsers ? state.totalUsers : ""}
        roleToFilter={state.roleToFilter}
        onResetState={handleResetState}
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
  );
};

export default UserManage;

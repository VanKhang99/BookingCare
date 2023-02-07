import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalAddUser, ModalEditUser, TableList } from "../index";
import { HiPlusSm, HiOutlineTrash } from "react-icons/hi";
import { MdModeEdit } from "react-icons/md";
import { getAllUserRedux, handleDisplayModal } from "../../slices/systemSlice";
import "../styles/UserManage.scss";
import "bootstrap/dist/css/bootstrap.css";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
} from "../../services/userService.js";

const UserManage = () => {
  const dispatch = useDispatch();
  const { users, isModalEditUserOpen, isModalAddUserOpen, dataUserEdit } =
    useSelector((store) => store.system);

  const handleGetAllUsers = async () => {
    const usersResponse = await getAllUsers();
    if (usersResponse && usersResponse.status === "success") {
      dispatch(getAllUserRedux(usersResponse.data.users));
    }
  };

  const handleModal = (isModalEdit, dataEdit) => {
    dispatch(handleDisplayModal({ isModalEdit, dataEdit }));
  };

  const handleCreateNewUser = async (data) => {
    delete data.errorInput;
    try {
      const response = await createUser(data);
      console.log(response);

      if (response.data?.status === "error") {
        return { haveError: true, message: response.data.message };
      }

      await handleGetAllUsers();
      return { haveError: false, message: "" };
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      const response = await editUser(userData.id, userData);
      if (response.status === "success") {
        await handleGetAllUsers();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      await handleGetAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  return (
    <div className="user-container">
      <ModalAddUser
        show={isModalAddUserOpen}
        onHide={() => handleModal(false, null)}
        createNewUser={handleCreateNewUser}
      />

      {isModalEditUserOpen && (
        <ModalEditUser
          show={isModalEditUserOpen}
          onHide={() => handleModal(true, null)}
          dataEdit={dataUserEdit}
          doEditUser={handleEditUser}
          // createNewUser={handleCreateNewUser}
        />
      )}

      <div className="user-title text-center mt-3">Manage Users</div>

      <div className="button-add-user mt-3 mb-4">
        <button
          className="btn btn-primary"
          onClick={() => handleModal(false, null)}
        >
          <HiPlusSm />
          <span>Create</span>
        </button>
      </div>

      <TableList
        users={users}
        onEditUserData={handleModal}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserManage;

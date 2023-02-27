import React from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineTrash } from "react-icons/hi";
import { MdModeEdit } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/TableList.scss";

const TableList = ({ users, redux, onEditDataUser, onDeleteUser }) => {
  const { t } = useTranslation();

  return (
    <div className={`table-container mt-3 ${redux ? "table-container-redux" : ""}`}>
      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Email</th>
            <th scope="col">{t("user-manage.first-name")}</th>
            <th scope="col">{t("user-manage.last-name")}</th>
            <th scope="col">{t("user-manage.address")}</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.length > 0 &&
            users.map((user, index) => {
              let { id, email, firstName, lastName, address } = user;
              return (
                <tr key={id}>
                  <th scope="row">{id}</th>
                  <td>{email}</td>
                  <td>{firstName}</td>
                  <td>{lastName}</td>
                  <td>{address}</td>
                  <td>
                    <button
                      type="button"
                      className="table-button table-button-edit me-4"
                      onClick={() => onEditDataUser(true, id)}
                    >
                      <MdModeEdit />
                    </button>
                    <button
                      type="button"
                      className="table-button table-button-delete"
                      onClick={() => onDeleteUser(user)}
                    >
                      <HiOutlineTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;

import React from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineTrash } from "react-icons/hi";
import { MdModeEdit } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/TableList.scss";

const TableList = ({ users, redux, onEditUserData, onDeleteUser }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`table-container mt-3 ${redux ? "table-container-redux" : ""}`}
    >
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Email</th>
            <th scope="col">{t("user-redux.first-name")}</th>
            <th scope="col">{t("user-redux.last-name")}</th>
            <th scope="col">{t("user-redux.address")}</th>
            <th scope="col">{t("user-redux.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.length > 0 &&
            users.map((user, index) => {
              let { id, email, firstName, lastName, address } = user;
              return (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  <td>{email}</td>
                  <td>{firstName}</td>
                  <td>{lastName}</td>
                  <td>{address}</td>
                  <td>
                    <button
                      type="button"
                      className="table-button table-button-edit me-4"
                      onClick={() => onEditUserData(true, user)}
                    >
                      <MdModeEdit />
                    </button>
                    <button
                      type="button"
                      className="table-button table-button-delete"
                      onClick={() => onDeleteUser(id)}
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

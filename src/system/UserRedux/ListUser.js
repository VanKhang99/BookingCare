import React, { useState, useEffect } from "react";
import slugify from "slugify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TableList } from "../index";
import { Pagination } from "../../components";
import { getAllUsers } from "../../slices/userSlice";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/UserManage.scss";
import "../styles/ListUser.scss";

const initialState = {
  optionsRole: [],
  roleSelected: "",
};

const ListUser = ({
  users,
  total,
  page,
  limit,
  rolesUser,
  onEditDataUser,
  onPageChange,
  onDeleteUser,
  onFilterUsers,
}) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleOptionsRoles = (dataRoles) => {
    let options = [];
    options.push(language === "vi" ? "Tất cả" : "All");
    dataRoles.forEach((role) => {
      if (role === "R1") {
        options.push(language === "vi" ? "Quản trị viên" : "Admin");
      } else if (role === "R7") {
        options.push(language === "vi" ? "Bệnh nhân" : "Patient");
      } else {
        options.push(language === "vi" ? "Bác sĩ" : "Doctor");
      }
    });
    options = new Set(options);

    return setState({ ...state, optionsRole: [...options] });
  };

  const handleRoleChange = async (e) => {
    try {
      const roleToFilter = slugify(e.target.value, { lower: true });
      const result = await dispatch(getAllUsers({ page: "", limit: "", role: roleToFilter }));
      if (result?.payload?.users.length) {
        const totalUsersFromServer = result.payload.countUsers.count;
        const newUserArr = result.payload.users;
        onFilterUsers(totalUsersFromServer, newUserArr, roleToFilter);
      }

      // return setState({ ...state, roleSelected: e.target.value });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (rolesUser.length) {
      handleOptionsRoles(rolesUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, rolesUser.length]);

  return (
    <div className="list-user container">
      <div className="list-user-header">
        <h3 className="list-user-header__title">{t("user-manage.list-users").toUpperCase()}</h3>

        <div className="list-user-filter">
          {state.optionsRole.length > 0 && (
            <select onChange={handleRoleChange}>
              {state.optionsRole.map((role) => {
                return (
                  <option key={role} value={role}>
                    {role}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      </div>

      <TableList
        users={users.length > 0 ? users : []}
        redux
        onEditDataUser={onEditDataUser}
        onDeleteUser={onDeleteUser}
      />

      <Pagination total={total} page={page} limit={limit} onPageChange={onPageChange} />
    </div>
  );
};

export default ListUser;

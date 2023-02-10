import React from "react";
import { Pagination as Pages } from "antd";
import "../styles/Pagination.scss";

const Pagination = ({ total, page, limit, onPageChange }) => {
  return (
    <Pages current={page} total={total} pageSize={limit} className="pagination" onChange={onPageChange} />
  );
};

export default Pagination;

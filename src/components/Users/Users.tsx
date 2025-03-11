import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../../redux/user/userSlice";
import { AppDispatch } from "../../redux/store";
import { Table, Pagination } from "antd";
import "./Users.module.scss";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useTypedSelector(selectUsers);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
    },
  ];

  return (
    <div className="styledWrapper">
      <h1>User List</h1>

      <div className="table">
        <Table
          columns={columns}
          dataSource={currentUsers}
          pagination={false}
          rowKey="id"
        />
      </div>

      <Pagination
        current={currentPage}
        total={users.length}
        pageSize={itemsPerPage}
        onChange={setCurrentPage}
        onShowSizeChange={(current, size) => setItemsPerPage(size)}
        showSizeChanger={true}
        showQuickJumper
        responsive
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </div>
  );
};

export default Users;

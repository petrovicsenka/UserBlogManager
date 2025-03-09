import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../../redux/user/userSlice";
import { AppDispatch } from "../../redux/store";
import "./Users.module.scss";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useTypedSelector(selectUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="styledWrapper">
      <h1>User List</h1>

      <table className="table">
        <thead>
          <tr>
            <th className="th">ID</th>
            <th className="th">First Name</th>
            <th className="th">Last Name</th>
            <th className="th">Email</th>
            <th className="th">Gender</th>
            <th className="th">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="td">{user.id}</td>
              <td className="td">{user.first_name}</td>
              <td className="td">{user.last_name}</td>
              <td className="td">{user.email}</td>
              <td className="td">{user.gender}</td>
              <td className="td">{user.ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

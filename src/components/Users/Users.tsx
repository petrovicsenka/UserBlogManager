import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../../redux/user/userSlice";
import { AppDispatch } from "../../redux/store";
import "./Users.module.scss";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useTypedSelector(selectUsers);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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
          {currentUsers.map((user) => (
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

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Users;

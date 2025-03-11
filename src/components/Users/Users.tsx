import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../../redux/user/userSlice";
import { AppDispatch } from "../../redux/store";
import { Table, Pagination } from "antd";
import { BlogPost, getMembers, User } from "../../data/data";
import "./Users.module.scss";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useTypedSelector(selectUsers);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
    getMembers().then((posts) => {
      setBlogPosts(posts);
    });
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

  // Function to render blog posts for each user
  const expandedRowRender = (user: User) => {
    // Filter blog posts for the selected user
    const userPosts = blogPosts.filter((post) => post.userId === user.id);

    return (
      <>
        <h3>Blog Posts</h3>
        <ul>
          {userPosts.length > 0 ? (
            userPosts.map((post: BlogPost) => (
              <li key={post.id}>
                <p>{post.title}</p>
              </li>
            ))
          ) : (
            <p>No blog posts found for this user.</p>
          )}
        </ul>
      </>
    );
  };

  return (
    <>
      <h1>User List</h1>

      <Table
        columns={columns}
        dataSource={currentUsers}
        pagination={false}
        rowKey="id"
        expandable={{
          expandedRowRender,
        }}
      />

      <Pagination
        current={currentPage}
        total={users.length}
        pageSize={itemsPerPage}
        onChange={setCurrentPage}
        onShowSizeChange={(current, size) => setItemsPerPage(size)}
        showSizeChanger={true}
        showQuickJumper
        responsive
        style={{ marginTop: "1%", display: "flex", justifyContent: "center" }}
      />
    </>
  );
};

export default Users;

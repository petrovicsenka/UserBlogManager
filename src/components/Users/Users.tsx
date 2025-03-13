import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../../redux/user/userSlice";
import { AppDispatch } from "../../redux/store";
import { Table, Pagination, message, Button, Input } from "antd";
import {
  BlogPost,
  getMembers,
  User,
  deleteUser,
  deleteBlogPost,
  addBlogPost,
} from "../../data/data";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
// import "./Users.module.scss";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useTypedSelector(selectUsers);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchUsers());
    getMembers().then((posts) => {
      setBlogPosts(posts);
    });
  }, [dispatch]);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("User deleted successfully!");
      dispatch(fetchUsers());
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      message.success("Blog post deleted successfully!");
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      message.error("Failed to delete blog post.");
    }
  };

  const handleAddBlogPost = async (
    userId: number,
    title: string,
    content: string,
  ) => {
    if (!title.trim() || !content.trim()) {
      message.warning("Title and content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const newPost: BlogPost = {
        id: crypto.randomUUID(),
        userId,
        datePosted: new Date().toISOString(),
        title,
        body: content,
      };

      const addedPost = await addBlogPost(newPost);
      setBlogPosts((prevPosts) => [addedPost, ...prevPosts]);
      message.success("Blog post added successfully!");
    } catch (error) {
      message.error("Failed to add blog post.");
    } finally {
      setLoading(false);
    }
  };

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
    {
      title: "Action",
      key: "action",
      render: (record: User) => (
        <DeleteOutlined
          onClick={() => handleDeleteUser(record.id)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Delete
        </DeleteOutlined>
      ),
    },
  ];

  const [newPosts, setNewPosts] = useState<{
    [userId: number]: { title: string; content: string };
  }>({});

  const expandedRowRender = (user: User) => {
    const userPosts = blogPosts.filter((post) => post.userId === user.id);

    return (
      <>
        <h3>Blog Posts</h3>
        <ul>
          {userPosts.length > 0 ? (
            userPosts.map((post: BlogPost) => (
              <li
                key={post.id}
                onClick={() =>
                  navigate(`/blog/${post.id}`, { state: { post } })
                }
                style={{ margin: "0.5% 1%", cursor: "pointer" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1d2bb8";
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                <span>{post.title}</span>
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBlogPost(post.id);
                  }}
                  style={{
                    color: "#1d2bb8",
                    cursor: "pointer",
                    marginLeft: 10,
                  }}
                />
              </li>
            ))
          ) : (
            <p>No blog posts found for this user.</p>
          )}
        </ul>

        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <Input
            type="text"
            placeholder="Title"
            value={newPosts[user.id]?.title || ""}
            onChange={(e) =>
              setNewPosts((prev) => ({
                ...prev,
                [user.id]: { ...prev[user.id], title: e.target.value },
              }))
            }
            style={{ flex: 1, padding: "5px" }}
          />
          <Input
            type="text"
            placeholder="Content"
            value={newPosts[user.id]?.content || ""}
            onChange={(e) =>
              setNewPosts((prev) => ({
                ...prev,
                [user.id]: { ...prev[user.id], content: e.target.value },
              }))
            }
            style={{ flex: 1, padding: "5px" }}
          />
          <Button
            onClick={() => {
              handleAddBlogPost(
                user.id,
                newPosts[user.id]?.title || "",
                newPosts[user.id]?.content || "",
              );
              setNewPosts((prev) => ({
                ...prev,
                [user.id]: { title: "", content: "" },
              }));
            }}
            disabled={loading}
            style={{ padding: "5px 10px" }}
          >
            {loading ? "Adding..." : "Add Post"}
          </Button>
        </div>
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

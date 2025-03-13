import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogPost, deleteBlogPost, editBlogPost } from "../../data/data";
import blogPostsData from "../../data/blog-posts.json";
import { Card, Typography, Spin, Button, Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);

  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedBody, setEditedBody] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      const foundPost = blogPostsData.find((p) => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
        setEditedTitle(foundPost.title);
        setEditedBody(foundPost.body);
      }
      setLoading(false);
    }, 500);
  }, [postId]);

  const handleSave = async () => {
    if (!post) return;

    try {
      const updatedPost = await editBlogPost(post.id, {
        title: editedTitle,
        body: editedBody,
        userId: post.userId,
        datePosted: post.datePosted,
      });

      setPost(updatedPost);
      setEditing(false);
      message.success("Blog post updated successfully!");
    } catch (error) {
      message.error("Failed to update blog post.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
      </div>
    );
  }

  if (!post) {
    return (
      <Title level={2} style={{ textAlign: "center" }}>
        Blog post not found.
      </Title>
    );
  }

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      await deleteBlogPost(post.id);
      message.success("Blog post deleted successfully!");
      navigate("/");
    } catch (error) {
      message.error("Failed to delete blog post.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        maxWidth: "840px",
        margin: "0 auto",
      }}
    >
      <Button
        onClick={() => navigate("/")}
        style={{ marginBottom: 20, alignSelf: "flex-start" }}
      >
        Back
      </Button>

      <Card
        style={{
          maxWidth: 800,
          width: "100%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {editing ? (
          <>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={{ fontSize: "20px", marginBottom: "10px" }}
            />
            <Input.TextArea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={5}
              style={{ fontSize: "16px" }}
            />
            <Button
              color="default"
              variant="solid"
              onClick={handleSave}
              style={{ marginTop: 10 }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Title level={2}>{post.title}</Title>
            <Text type="secondary">
              <strong>Date Posted:</strong>{" "}
              {new Date(post.datePosted).toLocaleDateString("sr-RS")}
            </Text>
            <Paragraph
              style={{
                marginTop: 20,
                fontSize: "16px",
                lineHeight: "1.6",
                textAlign: "justify",
              }}
            >
              {post.body}
            </Paragraph>
            <Button onClick={() => setEditing(true)} style={{ marginTop: 10 }}>
              Edit
            </Button>
            <Button
              danger
              onClick={handleDeletePost}
              style={{ marginTop: 10, marginLeft: 10 }}
            >
              Delete
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default BlogPostPage;

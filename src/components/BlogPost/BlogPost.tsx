import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogPost } from "../../data/data";
import blogPostsData from "../../data/blog-posts.json";
import { Card, Typography, Spin, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// import "./BlogPost.module.scss";

const { Title, Text, Paragraph } = Typography;

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      const foundPost = blogPostsData.find((p) => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      }
      setLoading(false);
    }, 500);
  }, [postId]);

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
        color="default"
        variant="solid"
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
      </Card>
    </div>
  );
};

export default BlogPostPage;

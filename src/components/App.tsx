import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../redux/user/userSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";
import Users from "./Users/Users";
import BlogPost from "./BlogPost/BlogPost";

const StyledWrapper = styled.div`
  padding: 24px;
`;

export const App = () => {
  const dispatch = useAppDispatch();
  const users = useTypedSelector(selectUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Router>
      <StyledWrapper>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </StyledWrapper>
    </Router>
  );
};

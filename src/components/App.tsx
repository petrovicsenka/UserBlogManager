import React, { useEffect } from "react";
import styled from "styled-components";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../redux/user/userSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";
import Users from "./Users/Users";

const StyledWrapper = styled.div`
  padding: 24px;
`;

export const App = () => {
  const dispatch = useAppDispatch();
  const users = useTypedSelector(selectUsers);
  const subsetOfUsers = users.slice(0, 10); // TODO: Remove this when you have found a better way to not show all users at once

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <StyledWrapper>
      <GlobalStyles />

      <h1>UserBlog</h1>

      <Users />
    </StyledWrapper>
  );
};

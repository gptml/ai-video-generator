import * as React from 'react';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from "react";
import TokesCount from "./TokesCount";
import UserDropdown from "./UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getProfileRequest } from "../store/reducers/users";
import { useNavigate } from "react-router";
import Header from "./Header";

export default function Wrapper(props) {

  const { children, className } = props;
  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

  return (
    <>
      <CssBaseline />
      <Header/>

      <Box component="main" sx={{ flexGrow: 1, px: 3, py: 10 }}>
        {children}
      </Box>
    </>
  );
}

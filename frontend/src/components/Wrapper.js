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

export default function Wrapper(props) {

  const { children, className } = props;
  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

  return (
    <Box sx={{ display: 'flex' }} className={className}>
      <CssBaseline />
      <MuiAppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" noWrap component="div" onClick={() => navigate('/')}>
            AI video generator
          </Typography>
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <TokesCount />
            <UserDropdown name={user.name} role={user.role} />
          </Box>
        </Toolbar>


      </MuiAppBar>

      <Box component="main" sx={{ flexGrow: 1, px: 3, py: 10 }}>
        {children}
      </Box>
    </Box>
  );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from "@mui/icons-material/Logout";
import { useCallback } from "react";

export default function Wrapper(props) {

  const { children, className } = props;

  const onLogout = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, [])

  return (
    <Box sx={{ display: 'flex' }} className={className}>
      <CssBaseline />
      <MuiAppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
          <Typography variant="h6" noWrap component="div">
            AI video generator
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>


      </MuiAppBar>

      <Box component="main" sx={{ flexGrow: 1, px: 3, py: 10 }}>
        {children}
      </Box>
    </Box>
  );
}

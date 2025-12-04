import { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import * as React from "react";
import { useNavigate } from "react-router";

export default function UserDropdown({ name = "User", role }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => {
    localStorage.clear();
    window.location.reload();

  };

  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <Box>
      <IconButton onClick={handleOpen} size="small">
        <Avatar sx={{
          bgcolor: "#4b9fff",
          color: "#fff",
          width: 42,
          height: 42,
          fontSize: 20,
          fontWeight: 700
        }}>{firstLetter}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5 }
        }}
      >
        <Box px={2} py={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {name}
          </Typography>
        </Box>

        {/*{role === 'admin' ? <MenuItem onClick={handleClose}>пользователи</MenuItem> : null}*/}
        {role === 'admin' ?
          <MenuItem onClick={() => navigate('/generation-settings')}>настройки генераций</MenuItem> : null}
        <MenuItem onClick={() => navigate('/history')}>история генераций</MenuItem>
        <MenuItem onClick={handleClose}><LogoutIcon sx={{ fontSize: 18, marginRight: 1 }} /> выход</MenuItem>
      </Menu>
    </Box>
  );
}

import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import _ from "lodash";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { registerUserRequest } from "../store/reducers/users";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({});


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = useCallback((key, value) => {
    _.set(formData, key, value);
    setFormData({ ...formData });
  }, [formData])

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault()
    if (!_.isEqual(formData.password, formData.confirmPassword)) {
      toast.error('Пароли не совпадают')
    } else {

      const { payload } = await dispatch(registerUserRequest(formData))
      if (payload.errors?.email) {
        toast.error('Электронная почта уже существует')
      } else {
        toast.success('успешно зарегистрирован')
      }

    }
    console.log(formData)
  }, [formData])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        p: 2,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Зарегистрироваться
        </Typography>

        <TextField
          label="Полное имя"
          fullWidth
          margin="normal"
          onChange={(ev) => handleChange('name', ev.target.value)}
          value={formData.name}
        />

        <TextField
          label="Электронная почта"
          type="email"
          fullWidth
          margin="normal"
          onChange={(ev) => handleChange('email', ev.target.value)}
          value={formData.email}
        />

        <TextField
          label="Пароль"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          onChange={(ev) => handleChange('password', ev.target.value)}
          value={formData.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Подтвердите пароль"
          type={showConfirm ? "text" : "password"}
          fullWidth
          margin="normal"
          onChange={(ev) => handleChange('confirmPassword', ev.target.value)}
          value={formData.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2, py: 1.2 }}
          type="submit"
          disabled={!formData.name}
        >
          Зарегистрироваться
        </Button>

        <Typography
          variant="body2"
          textAlign="center"
          mt={2}
          sx={{ cursor: "pointer" }}
        >
          Уже есть аккаунт?
          <Button
            variant="text"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => navigate('/login')}
          >
            Войти
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

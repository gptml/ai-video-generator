import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { loginRequest } from "../store/reducers/app";
import _ from "lodash";
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleChange = useCallback((path, value) => {
    setError('');
    setFormData((data) => {
      _.set(data, path, value);
      return { ...data };
    })
  }, []);

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    const { payload } = await dispatch(loginRequest(formData))
    if (payload?.status === 'error') {
      setError(payload.message)
    }
  }, [formData, dispatch])

  return (
    <div id="login">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
         AI video generator
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Электронная почта</FormLabel>
            <TextField
              error={!!error}
              value={formData.email}
              type="email"
              name="email"
              placeholder="your@email.com"
              autoFocus
              required
              fullWidth
              onChange={(ev) => handleChange('email', ev.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Пароль</FormLabel>
            <TextField
              error={!!error}
              helperText={error}
              value={formData.password}
              placeholder="••••••"
              id="password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              onChange={(ev) => handleChange('password', ev.target.value)}
              type={showPassword ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                },
              }}
            />
          </FormControl>
          <Button type="submit" size="large" sx={{ mt: 2 }} fullWidth variant="contained">
            Войти
          </Button>
        </Box>
      </Card>
    </div>
  );
}

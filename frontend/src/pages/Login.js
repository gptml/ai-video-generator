import React, { useState } from 'react';
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { loginRequest } from "../store/reducers/users";
import _ from "lodash";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Input from "../components/form/Input";
import logo from '../assets/icons/logo-svg.svg';
import { Link } from 'react-router';

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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logo} alt="Your Company" className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mt-2">
            <Input
              label="Email address"
              onChange={(ev) => handleChange('email', ev.target.value)}
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              className={error ? "bg-red-50 border border-red-300" : null}

            />
          </div>
          <div className="relative mt-2">
            <Input
              label="Password"
              onChange={(ev) => handleChange('password', ev.target.value)}
              value={formData.password}
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              className={error ? "bg-red-50 border border-red-300" : null}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-black-500"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          <div>
            <button type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign
              in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-black-400">
          У вас нет учетной записи?
          <Link to="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-300 ml-2">Зарегистрироваться</Link>
        </p>
      </div>
    </div>

  )

}

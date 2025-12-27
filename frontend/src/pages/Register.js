import React, { useCallback, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router";
import _ from "lodash";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { registerUserRequest } from "../store/reducers/users";
import logo from "../assets/icons/logo-svg.svg";
import Input from "../components/form/Input";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({});


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
  }, [formData])

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={logo} alt="Your Company" className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">Зарегистрироваться</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mt-2">
            <Input
              label="Полное имя"
              onChange={(ev) => handleChange('name', ev.target.value)}
              id="name"
              type="text"
              name="name"
              required
              value={formData.name}
            />
          </div>
          <div className="mt-2">
            <Input
              label="Email address"
              onChange={(ev) => handleChange('email', ev.target.value)}
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-black-500"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          <div className="relative mt-2">
            <Input
              label="Подтвердите пароль"
              onChange={(ev) => handleChange('confirmPassword', ev.target.value)}
              value={formData.confirmPassword}
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-black-500"
            >
              {showConfirm ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>


          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-black-400">
          Уже есть аккаунт?
          <Link to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 ml-2">Войти</Link>
        </p>
      </div>
    </div>

  )

}

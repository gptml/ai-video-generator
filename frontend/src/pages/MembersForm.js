import * as React from 'react';
import Wrapper from "../components/Wrapper";
import { useCallback, useEffect, useState } from "react";
import { Grid, MenuItem, Pagination } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import _ from "lodash";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { createMemberRequest, fetchSingleMember, updateMemberRequest } from "../store/reducers/members";
import { toast } from "react-toastify";

const statusList = [
  { value: 'active', label: 'Active' },
  { value: 'banned', label: 'Banned' },
  { value: 'inactive', label: 'Inactive' },
]
export default function MembersForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    publicCode: "",
    contribution: "",
    birthday: "",
    rating: "",
    status: "active",
    password: "",
  })

  const { memberId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (memberId) {
      dispatch(fetchSingleMember(memberId))
        .then(({ payload }) => {
          setFormData(payload.member)
        })
    }

  }, [dispatch, memberId])

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    if (memberId) {
      formData.id = memberId;
      await dispatch(updateMemberRequest(formData))
    } else {
      const { payload } = await dispatch(createMemberRequest(formData));
      navigate(`/members/update/${payload.member.id}`);
    }
    toast.success("Успешно сохранено");
  }, [memberId, formData]);


  const handleChange = useCallback((path, value) => {
    setFormData((data) => {
      _.set(data, path, value);
      return { ...data };
    })
  }, []);


  return (
    <Wrapper className="members-form">
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Typography variant="h4" noWrap component="div" sx={{ mb: 4 }}>
            {memberId ? 'Редактировать участника' : 'Новый участник'}
          </Typography>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              pb: 3
            }}
            spacing={2}
            style={{ width: '100%', }}
          >
            <Grid size={6}>
              <TextField
                sx={{ width: '100%' }}
                value={formData.publicCode}
                onChange={(ev) => handleChange('publicCode', ev.target.value)}
                label="Публичный код" />
            </Grid>
            <Grid size={6}>
              <TextField
                sx={{ width: '100%' }}
                value={formData.fullName}
                onChange={(ev) => handleChange('fullName', ev.target.value)}
                label="Полное Имя"
              />
            </Grid>
            <Grid size={6}>
              <DatePicker
                size="small"
                sx={{ width: '100%' }}
                value={formData.birthday ? moment(formData.birthday) : null}
                onChange={(val) => handleChange('birthday', moment(val).toISOString())}
                label="День рождения"
                type="date"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                sx={{ width: '100%' }}
                type="number"
                value={formData.contribution}
                onChange={(ev) => handleChange('contribution', ev.target.value)}
                label="Вклад"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                sx={{ width: '100%' }}
                value={formData.rating}
                onChange={(ev) => handleChange('rating', ev.target.value)}
                label="Рейтинг"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                sx={{ width: '100%' }}
                value={formData.password}
                onChange={(ev) => handleChange('password', ev.target.value)}
                label="Пароль"
                placeholder={1 ? 'Скрытый' : ''}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                select
                sx={{ width: '100%' }}
                label="Статус"
                value={formData.status}
                onChange={(ev) => handleChange('status', ev.target.value)}
              >
                {statusList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

          </Grid>
          <Button variant="contained" type="submit">
            {memberId ? 'Обновить' : 'Саздат'}
          </Button>
        </LocalizationProvider>
      </form>

    </Wrapper>
  );
}

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Wrapper from "../components/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { enableMemberLogin, fetchMembers } from "../store/reducers/members";
import { Grid, Pagination, Switch } from "@mui/material";
import moment from "moment";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearchParams } from "react-router";
import TextField from "@mui/material/TextField";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router';

let searchTimeout;
export default function Members(x) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const members = useSelector((state) => state.members.members);
  const membersData = useSelector((state) => state.members.membersData);
  const membersStatus = useSelector((state) => state.members.membersStatus);
  // const [page, setPage] = useState(1);

  const page = +searchParams.get('page') || 1;
  const s = searchParams.get('s') || '';

  const [search, setSearch] = useState(s);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    dispatch(fetchMembers({ page, s }));
  }, [dispatch, page, s]);

  const handleChangePage = useCallback((e, page) => {
    setSearchParams({ page });
  }, []);


  const handleSearch = useCallback((ev) => {
    const { value } = ev.target;
    setSearch(value);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setSearchParams({ page: 1, s: value });
    }, 500)
  }, []);

  const handleEnableLogin = useCallback((id) => {
    dispatch(enableMemberLogin(id));
  }, []);

  return (
    <Wrapper className="members">
      <div className="members-container">
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
          <TextField size="small" sx={{ width: '40ch' }} value={search} onChange={handleSearch}
                     label="Поиск" variant="outlined" />
          <Button variant="contained" href='/members/create'>Добавить участника</Button>
        </Grid>
        <LinearProgress sx={{ width: '100%', opacity: membersStatus === 'request' ? 1 : 0 }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Код</TableCell>
                <TableCell>Полное Имя</TableCell>
                <TableCell>дата регистрации</TableCell>
                <TableCell>сумма вклада</TableCell>
                <TableCell>status</TableCell>
                <TableCell>rating</TableCell>
                <TableCell>Включить вход</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.publicCode}
                  </TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{moment(row.createdAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{row.contribution.toLocaleString('ru-RU') + ' $'}</TableCell>
                  <TableCell>
                    <div className="status-row">
                      <div className={`status-indicator ${row.status}`} />
                      <span>{row.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.rating}</TableCell>
                  <TableCell>
                    <Switch checked={row.isLoginEnabled} onChange={() => handleEnableLogin(row.id)} />
                  </TableCell>
                  <TableCell>
                    <Link to={`/members/update/${row.id}`}>
                      <EditIcon sx={{
                        color: 'gray',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'black',
                        },
                      }} />
                    </Link>

                    <DeleteIcon sx={{
                      color: 'red',
                      cursor: 'pointer',
                    }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={membersData.totalPages || 0}
          page={page}
          onChange={handleChangePage} />
      </div>
    </Wrapper>
  );
}

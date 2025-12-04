import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography, Button, Stack, Pagination
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGenerationHistoryRequest } from "../store/reducers/generateVideo";
import Wrapper from "../components/Wrapper";
import moment from "moment";

export default function History() {

  const history = useSelector((state) => state.generateVideo.generationHistory);
  const totalPages = useSelector((state) => state.generateVideo.totalPages);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenerationHistoryRequest())
  }, [])
  return (
    <Wrapper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          История генераций
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell>TaskId</TableCell>
                <TableCell>Результат</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Нет данных
                  </TableCell>
                </TableRow>
              ) : (
                history.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.taskId}</TableCell>
                    <TableCell>
                      {row.state === 'success' && row.result && !moment(row.expireTime).isBefore(moment()) ?
                        <Button size="small" color="primary" component="a" target="_blank" href={row.result}
                                variant="contained">
                          Скачать
                        </Button> : null}
                      {row.state === 'generating' ? <span style={{ color: 'green' }}>Генерация</span> : null}
                      {row.state === 'fail' ? <span style={{ color: 'red' }}>Неудача</span> : null}
                      {row.state === 'success' && moment(row.expireTime).isBefore(moment()) ?
                        <span style={{ color: 'orange' }}>Истекший</span> : null}
                    </TableCell>
                  </TableRow>
                ))
              )}

            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 ? <Stack spacing={2} sx={{ marginTop: 2 }}>
          <Pagination count={totalPages} onChange={(ev, val) => dispatch(getGenerationHistoryRequest(val))} />
        </Stack> : null}
      </Paper>
    </Wrapper>
  );
}

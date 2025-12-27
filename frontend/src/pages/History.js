import * as React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Stack, Pagination
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
  return (<Wrapper>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">История генераций</h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Модель</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">TaskId</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Результат</th>
          </tr>
          </thead>
          <tbody id="history-body">
          {history.length === 0 ? (<tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">Нет данных</td>
          </tr>) : (history.map((row) => (<tr className="border-b" key={row.id}>
            <td className="px-4 py-3">{row.id}</td>
            <td className="px-4 py-3">{row.title}</td>
            <td className="px-4 py-3">{row.taskId}</td>
            <td className="px-4 py-3">
              {row.state === 'success' && row.result && !moment(row.expireTime).isBefore(moment()) ?
                <a className="inline-block px-2 py-1 text-xs border border-blue-500 text-blue-600 rounded"
                   href={row.result}
                   target="_blank" rel="noreferrer">Скачать</a> : null}
              {row.state === 'generating' ?
                <span className="inline-block px-2 py-1 text-xs border border-green-500 text-green-600 rounded">
                      Генерация
                </span> : null}
              {row.state === 'fail' ?
                <span className="inline-block px-2 py-1 text-xs border border-red-500 text-red-600 rounded">
                Неудача
                </span> : null}
              {row.state === 'success' && moment(row.expireTime).isBefore(moment()) ?
                <span
                  className="inline-block px-2 py-1 text-xs border border-orange-500 text-orange-600 rounded">
                Истёкший
                </span> : null}
            </td>
          </tr>)))}
          </tbody>
        </table>
      </div>
    </div>

    {totalPages > 1 ? <Stack spacing={2} sx={{ marginTop: 2 }}>
      <Pagination count={totalPages} onChange={(ev, val) => dispatch(getGenerationHistoryRequest(val))} />
    </Stack> : null}
  </Wrapper>);
}

import * as React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Stack, Pagination
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGenerationHistoryRequest } from "../store/reducers/generateVideo";
import Wrapper from "../components/Wrapper";
import moment from "moment";
import { getUsersListRequest } from "../store/reducers/users";
import ChangeUserTokensModal from "../components/ChangeUserTokensModal";

export default function Users() {

  const [id, setId] = React.useState(null);

  const usersList = useSelector((state) => state.users.usersList);
  const totalPages = useSelector((state) => state.generateVideo.totalPages);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersListRequest())
  }, [])

  return (<Wrapper>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">История генераций</h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">tokens</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600" />
          </tr>
          </thead>
          <tbody id="history-body">
          {usersList.length === 0 ? (<tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">Нет данных</td>
          </tr>) : (usersList.map((row) => (<tr className="border-b" key={row.id}>
            <td className="px-4 py-3">{row.id}</td>
            <td className="px-4 py-3">{row.name}</td>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3">{row.tokens}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => setId(row.id)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Change token
              </button>
            </td>

          </tr>)))}
          </tbody>
        </table>
      </div>
    </div>
    {id ? <ChangeUserTokensModal
      id={id} onClose={() => setId(null)}
      tokens={usersList.find(u => u.id === id)?.tokens}
    /> : null}
    {totalPages > 1 ? <Stack spacing={2} sx={{ marginTop: 2 }}>
      <Pagination count={totalPages} onChange={(ev, val) => dispatch(getGenerationHistoryRequest(val))} />
    </Stack> : null}
  </Wrapper>);
}

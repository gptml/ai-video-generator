import React, { useCallback } from 'react';
import { useDispatch } from "react-redux";
import { changeUserTokenCountRequest, getUsersListRequest } from "../store/reducers/users";
import { toast } from "react-toastify";

function ChangeUserTokensModal({ id, onClose, tokens }) {
  const [token, setToken] = React.useState(tokens);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();

    const { payload } = await dispatch(changeUserTokenCountRequest({ id, tokens: token }))
    console.log(payload)
    if(payload.user){
      toast.success("sucessfully changed")
      await dispatch(getUsersListRequest())
    }
    else {
      toast.error("unknown user")
    }
    onClose();
    
  }, [token, id])
  return (
    <div
      id="modal"
      className="fixed inset-0 bg-black/50 flex items-center justify-center  z-50"
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4">Change tokens count</h2>

        <form className="space-y-4">
          <input
            value={token}
            onChange={ev => setToken(ev.target.value)}
            type="number"
            placeholder="Tokens count"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />


          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>

  );
}

export default ChangeUserTokensModal;

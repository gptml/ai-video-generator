import React, { useCallback, useEffect, useState } from 'react';
import Wrapper from "../components/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { changeTokenCount, changeTokenCountRequest, getAllModelsRequest } from "../store/reducers/generateVideo";
import * as icons from "../data/icons";
import noImage from '../assets/icons/file.svg'
import { toast } from "react-toastify";


function Settings() {

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const allModels = useSelector(state => state.generateVideo.allModels);

  useEffect(() => {
    dispatch(getAllModelsRequest())
  }, [])

  const handleCountChange = useCallback((token, id) => {
    dispatch(changeTokenCount({ token, id }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const { payload } = await dispatch(changeTokenCountRequest(allModels))
    if (payload.models) {
      toast.success('Successfully updated models.')
    }
    setLoading(false);
  }, [allModels])

  return (
    <Wrapper>
      <div className="flex justify-between items-center w-full">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Set tokens for each model</h1>
        <button
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
          onClick={handleSubmit}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          Save
        </button>
      </div>
      <ul className="divide-y divide-default grid grid-cols-2">
        {allModels.map((model) => (
          <li className="pb-3 sm:pb-4 mr-9">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src={icons[model.image] || noImage}
                  alt={model.title}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-medium text-heading truncate">
                  {model.title}
                </p>
                <p className="text-sm text-body truncate">
                  {model.subtitle}
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-heading">
                <div>
                  <div className="mt-2">
                    <div
                      className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                      <input
                        value={model.token}
                        onChange={(ev) => handleCountChange(ev.target.value, model.id)}
                        id="tokens"
                        type="number"
                        name="tokens"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </li>

        ))}


      </ul>


    </Wrapper>
  );
}

export default Settings;

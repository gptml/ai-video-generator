import React, { useCallback, useEffect } from 'react';
import Wrapper from "../../components/Wrapper";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { checkStatusRequest, generateVideoRequest, getSingleModelRequest } from "../../store/reducers/generateVideo";
import Image from "../../components/Image";
import { getProfileRequest } from "../../store/reducers/users";
import { useParams } from "react-router";
import File from "../../components/form/File";
import RowSelect from "../../components/form/RowSelect";

const upscalefactors = [
  { value: '1', label: '1x' },
  { value: '2', label: '2x' },
  { value: '3', label: '3x' },
];


function TopazImageForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'topaz/image-upscale',
    title: 'Topaz Image Upscaler',
    input: {upscale_factor:'1'}
  });


  const dispatch = useDispatch();
  const model = useSelector(state => state.generateVideo.singleModel);

  const { modelId } = useParams();

  useEffect(() => {
    dispatch(getSingleModelRequest(modelId))
  }, [])


  const handleChange = useCallback((key, value) => {
    _.set(formData, key, value);
    setFormData({ ...formData });
  }, [formData])


  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const { payload } = await dispatch(generateVideoRequest(formData))
    // const payload = { taskId: 'bedf681647c3d2dc8feafd6d59073730' }
    if (payload.error) {
      alert(payload.error)
    }
    if (!payload.taskId) {
      setLoading(false);
      return;
    }

    setState('generating');

    while (true) {
      const data = await dispatch(checkStatusRequest({
        taskId: payload.taskId,
        path: 'api/v1/jobs/recordInfo',
        title: formData.title
      }));

      const response = data.payload?.response;

      if (response?.resultUrls?.length) {
        setGeneratedContent(response.resultUrls[0]);
        setState('done');
        break;
      }

      if (response === 'Generation failed') {
        alert('Generation failed');
        setState('failed');
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    await dispatch(getProfileRequest());

    setLoading(false);
  }, [formData]);


  return (
    <Wrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="mr-20">
          <p className="text-xl">{model.title}</p>
          <p className='mt-1 text-sm/6 text-gray-600'>{model.description}</p>
          <form className="modelForm" onSubmit={handleSubmit}>

            <File
              value={formData.input.image_url}
              onChange={(ev) => {
                const file = ev.target.files[0];
                file.uri = URL.createObjectURL(file);
                handleChange('input.image_url', file)
              }}
              onFileDelete={() => handleChange('input.image_url', null)}
              accept="image/*"
            />


            <RowSelect
              label="фактор высокого качества"
              items={upscalefactors}
              onClick={(val) => handleChange('input.upscale_factor', val)}
              value={formData.input.upscale_factor}
            />
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
              Генерация
            </button>
          </form>
        </div>

        {generatedContent ? <Image src={generatedContent} href={generatedContent} /> : null}
      </div>
    </Wrapper>
  );
}

export default TopazImageForm;

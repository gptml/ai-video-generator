import React, { useCallback, useEffect } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { checkStatusRequest, generateVideoRequest, getSingleModelRequest } from "../../store/reducers/generateVideo";
import { getProfileRequest } from "../../store/reducers/users";
import File from "../../components/form/File";
import Image from "../../components/Image";
import { useParams } from "react-router";
import Textarea from "../../components/form/Textarea";
import Select from "../../components/form/Select";

const types = [
  {
    model: 'wan/2-2-animate-move',
    title: 'animate-move',
  },
  {
    model: 'wan/2-2-animate-replace',
    title: 'image-to-video',
  },
]

const resolutions = [
  { value: '480p', label: '480p' },
  { value: '580p', label: '580p' },
  { value: '720p', label: '720p' },
];

function WanAnimate() {

  const [type, setType] = React.useState('image-to-video');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'wan/2-2-animate-move',
    title: 'Wan 2.2 Animate',
    input: {
      resolution: '480p',
    }
  });


  const dispatch = useDispatch();
  const model = useSelector(state => state.generateVideo.singleModel);

  const { modelId } = useParams();

  useEffect(() => {
    dispatch(getSingleModelRequest(modelId))
  }, [])

  const handleSetType = useCallback((type) => {
    setType(type.title);
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

  console.log(formData, 8888)

  return (
    <Wrapper>
      <GenerationTypes
        types={types}
        onClick={handleSetType}
        selectedType={type}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="mr-20">
          <p className="text-xl">{model.title}</p>
          <p className='mt-1 text-sm/6 text-gray-600'>{model.description}</p>
          <form className="modelForm" onSubmit={handleSubmit}>

            <Textarea
              label="Текст"
              required
              onChange={(ev) => handleChange('input.prompt', ev.target.value)}
              value={formData.input.prompt}
              placeholder="введите ваше сообщение"
              hint="Текстовая подсказка, использованная для создания видео."
            />

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


            <File
              value={formData.input.video_url}
              onChange={(ev) => {
                const file = ev.target.files[0];
                file.uri = URL.createObjectURL(file);
                handleChange('input.video_url', file)
              }}
              onFileDelete={() => handleChange('input.video_url', null)}
              accept="video/*"
            />

            <Select
              label="Размер изображения"
              options={resolutions}
              onChange={(val) => handleChange('input.resolution', val.value)}
              value={resolutions.find(r => r.value === formData.resolution)}
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

export default WanAnimate;

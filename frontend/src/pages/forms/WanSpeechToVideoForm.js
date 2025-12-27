import React, { useCallback, useEffect } from 'react';
import Wrapper from "../../components/Wrapper";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { checkStatusRequest, generateVideoRequest, getSingleModelRequest } from "../../store/reducers/generateVideo";
import Image from "../../components/Image";
import { getProfileRequest } from "../../store/reducers/users";
import { useParams } from "react-router";
import Textarea from "../../components/form/Textarea";
import File from "../../components/form/File";
import Select from "../../components/form/Select";
import RowSelect from "../../components/form/RowSelect";
import Input from "../../components/form/Input";
import Switcher from "../../components/form/Switcher";
import GenerationTypes from "../../components/GenerationTypes";


const resolutions = [
  { value: '480p', label: '480p' },
  { value: '580p', label: '580p' },
  { value: '720p', label: '720p' },
];


function QwenImageForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'wan/2-2-a14b-speech-to-video-turbo',
    title: 'Wan speech to video',
    input: {
      resolution: '480p',
      enable_safety_checker: true,
    }
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
    const { payload } = await dispatch(generateVideoRequest({ ...formData, images: [formData.image] }))
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
            <Textarea
              label="Текст"
              required
              onChange={(ev) => handleChange('input.prompt', ev.target.value)}
              value={formData.input.prompt}
              placeholder="введите ваше сообщение"
              hint="Текстовая подсказка, использованная для создания видео."
            />

            <File
              value={formData.image}
              onChange={(ev) => {
                const file = ev.target.files[0];
                file.uri = URL.createObjectURL(file);
                handleChange('image', file)
              }}
              onFileDelete={() => handleChange('image', null)}
              accept="image/*"
            />

            <File
              value={formData.audio}
              onChange={(ev) => {
                const file = ev.target.files[0];
                file.uri = URL.createObjectURL(file);
                handleChange('audio', file)
              }}
              onFileDelete={() => handleChange('audio', null)}
              accept="audio/*"
              text='MPEG, MP3'
            />

            <Select
              label="Размер изображения"
              options={resolutions}
              onChange={(val) => handleChange('input.resolution', val.value)}
            />


            <Input
              max={120}
              label="The number of inference steps"
              type="number"
              onChange={(ev) => handleChange('input.num_frames', ev.target.value)}
            />

            <Input
              type="number"
              label="Использование случайного начального значения для контроля стохастичности генерации изображений."
              onChange={(ev) => handleChange('input.seed', ev.target.value)}
            />

            <Input
              label="The number of inference steps"
              type="number"
              onChange={(ev) => handleChange('input.num_inference_steps', ev.target.value)}
            />

            <Switcher
              enabled={formData.enable_safety_checker}
              onChange={() => handleChange('enable_safety_checker', !formData.enable_safety_checker)}
              label="Если установлено значение true, проверка безопасности будет включена"
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

export default QwenImageForm;

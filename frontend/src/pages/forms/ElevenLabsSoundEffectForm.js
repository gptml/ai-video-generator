import React, { useCallback, useEffect } from 'react';
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { checkStatusRequest, generateVideoRequest, getSingleModelRequest } from "../../store/reducers/generateVideo";
import Audio from "../../components/Audio";
import { getProfileRequest } from "../../store/reducers/users";
import File from "../../components/form/File";
import Switcher from "../../components/form/Switcher";
import { useParams } from "react-router";
import Textarea from "../../components/form/Textarea";
import Input from "../../components/form/Input";


function ElevenLabsSoundEffectForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'elevenlabs/sound-effect-v2',
    title: 'ElevenLabs Sound Effect',
    input: {
      loop: false,
      diarize: false,
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
            <Textarea
              label="Текст"
              required
              onChange={(ev) => handleChange('input.text', ev.target.value)}
              value={formData.input.prompt}
              placeholder="введите ваше сообщение"
              hint="Текстовая подсказка, использованная для создания видео."
            />

            <Input
              max={22}
              label="Duration in seconds (0.5-22). If None, optimal duration will be determined from prompt"
              type="number"
              onChange={(ev) => handleChange('input.duration_seconds', ev.target.value)}
            />

            <Switcher
              enabled={formData.loop}
              onChange={() => handleChange('loop', !formData.loop)}
              label="Стоит ли создавать звуковой эффект, который плавно зацикливается?"
            />

            <Switcher
              enabled={formData.diarize}
              onChange={() => handleChange('tag_audio_events', !formData.diarize)}
              label="Стоит ли указывать, кто говорит?"
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
      </div>
      // todo generatedContent is text
      {generatedContent ? <Audio src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default ElevenLabsSoundEffectForm;

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
import Input from "../../components/form/Input";
import Switcher from "../../components/form/Switcher";
import RowSelect from "../../components/form/RowSelect";


const renderingSpeeds = [
  { value: 'TURBO', label: 'TURBO' },
  { value: 'BALANCED', label: 'СБАЛАНСИРОВАННЫЙ' },
  { value: 'QUALITY', label: 'КАЧЕСТВО' },
];

const styles = [
  { value: 'AUTO', label: 'АВТО' },
  { value: 'GENERAL', label: 'ОБЩИЙ' },
  { value: 'REALISTIC', label: 'РЕАЛИСТИЧНЫЙ' },
  { value: 'DESIGN', label: 'ДИЗАЙН' },
];

const imageSizes = [
  { value: 'square', label: 'квадрат' },
  { value: 'square_hd', label: 'квадрат_hd' },
  { value: 'portrait_4_3', label: 'портрет_4_3' },
  { value: 'portrait_16_9', label: 'портрет_16_9' },
  { value: 'landscape_4_3', label: 'горизонтальный_4_3' },
  { value: 'landscape_16_9', label: 'горизонтальный_16_9' },
];

const numImages = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];


function IdeogramForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'ideogram/v3-reframe',
    title: 'Ideogram V3 Reframe Image',
    input: {
      image_size: 'square',
      rendering_speed: 'TURBO',
      style: 'AUTO',
      num_images: '1',
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

            <File
              value={formData.image_url}
              onChange={(ev) => {
                const file = ev.target.files[0];
                file.uri = URL.createObjectURL(file);
                handleChange('image_url', file)
              }}
              onFileDelete={() => handleChange('image_url', null)}
              accept="image/*"
            />

            <Select
              label="Размер изображения"
              options={imageSizes}
              onChange={(val) => handleChange('input.image_size', val.value)}
              value={imageSizes?.find(r => r.value === formData.image_size)}
            />


            <Select
              label="Скорость рендеринга"
              options={renderingSpeeds}
              onChange={(val) => handleChange('input.rendering_speed', val.value)}
              value={renderingSpeeds?.find(r => r.value === formData.rendering_speed)}
            />

            <Select
              label="Стили"
              options={styles}
              onChange={(val) => handleChange('input.style', val.value)}
              value={styles?.find(r => r.value === formData.style)}
            />

            <RowSelect
              label="Количество изображений"
              items={numImages}
              onClick={(val) => handleChange('input.num_images', val)}
              value={formData.input.num_images}
            />


            <Input
              type="number"
              label="Использование случайного начального значения для контроля стохастичности генерации изображений."
              onChange={(ev) => handleChange('input.seed', ev.target.value)}
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

export default IdeogramForm;

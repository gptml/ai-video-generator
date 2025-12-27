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


const imageSizes = [
  { value: 'square', label: 'квадрат' },
  { value: 'square_hd', label: 'квадрат_hd' },
  { value: 'portrait_4_3', label: 'портрет_4_3' },
  { value: 'portrait_16_9', label: 'портрет_16_9' },
  { value: 'landscape_4_3', label: 'горизонтальный_4_3' },
  { value: 'landscape_16_9', label: 'горизонтальный_16_9' },
];

const types = [
  {
    model: 'qwen/image-to-image',
    title: 'image-to-image',
  },
  {
    model: 'qwen/text-to-image',
    title: 'text-to-image',
  },
]


const accelerations = [
  { value: 'none', label: 'нет' },
  { value: 'regular', label: 'обычный' },
  { value: 'high', label: 'высокий' },
];

const numImages = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];

const outputFormat = [
  { value: 'png', label: 'png' },
  { value: 'jpg', label: 'jpg' },
];


function QwenImageForm() {

  const [state, setState] = React.useState('generating');
  const [type, setType] = React.useState('image-to-image');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'qwen/image-to-image',
    title: 'Qwen Image',
    input: {
      acceleration: 'none',
      image_size: 'square',
      num_inference_steps: 30,
      num_images: '1',
      enable_safety_checker: true,
      sync_mode: false,
      output_format: 'png',
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

  const handleSetType = useCallback((type) => {
    setType(type.title);
    handleChange('model', type.model);
    setGeneratedContent('')
  }, [])


  return (
    <Wrapper >
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

          {type === 'image-to-image' ? <File
            value={formData.input.image_url}
            onChange={(ev) => {
              const file = ev.target.files[0];
              file.uri = URL.createObjectURL(file);
              handleChange('input.image_url', file)
            }}
            onFileDelete={() => handleChange('input.image_url', null)}
            accept="image/*"
          /> : null}

          {type === 'text-to-image' ? <Select
            label="Размер изображения"
            options={imageSizes}
            onChange={(val) => handleChange('input.image_size', val.value)}
          /> : null}

          <RowSelect
            label="ускорение"
            items={accelerations}
            onClick={(val) => handleChange('input.acceleration', val)}
            value={formData.input.acceleration}
          />

          <RowSelect
            label="Количество изображений"
            items={numImages}
            onClick={(val) => handleChange('input.num_images', val)}
            value={formData.input.num_images}
          />

          <RowSelect
            label="Формат вывода"
            items={outputFormat}
            onClick={(val) => handleChange('input.output_format', val)}
            value={formData.input.output_format}
          />


          <Input
            label="The number of inference steps"
            type="number"
            onChange={(ev) => handleChange('input.num_inference_steps', ev.target.value)}
            value={formData.num_inference_steps}
          />

          <Switcher
            enabled={formData.sync_mode}
            onChange={() => handleChange('sync_mode', !formData.sync_mode)}
            label="Если установить значение true, функция будет ждать генерации и загрузки изображения, прежде чем вернуть ответ. Это увеличит задержку функции, но позволит получить изображение непосредственно в ответе, минуя CDN."
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

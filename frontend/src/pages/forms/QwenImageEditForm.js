import React, { useCallback } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, FormControlLabel, Switch, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";
import Video from "../../components/Video";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getProfileRequest } from "../../store/reducers/users";


const imageSizes = ['square', 'square_hd', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'];
const accelerations = ['none', 'regular', 'high'];
const numImages = ['1', '2', '3', '4'];
const outputFormat = ['png', 'jpg'];

function QwenImageEditForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'qwen/image-edit',
    title: 'Qwen Image Edit',
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
      <Typography variant="h4" sx={{ marginBottom: 2 }}>{formData.title}</Typography>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 600, marginBottom: 10 }}
        onSubmit={handleSubmit}
      >
        <TextField
          id="prompt"
          label="Текст"
          variant="outlined"
          fullWidth
          onChange={(ev) => handleChange('input.prompt', ev.target.value)}
        />
        <MuiFileInput
          label="Файл"
          variant="outlined"
          fullWidth
          InputProps={{
            inputProps: {
              accept: '.png, .jpeg, .jpg, .webp'
            },
            startAdornment: <AttachFileIcon />
          }}
          onChange={(file) => handleChange('image', file)}
          value={formData.image}
          getInputText={(file) => file ? file.name : 'Выберите файл'}

        />
        <TextField
          select
          label="Размер изображения"
          onChange={(ev) => handleChange('input.image_size', ev.target.value)}

        >
          {imageSizes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Ускорение"
          onChange={(ev) => handleChange('input.acceleration', ev.target.value)}

        >
          {accelerations.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Количество изображений"
          onChange={(ev) => handleChange('input.num_images', ev.target.value)}

        >
          {numImages.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="num_inference_steps"
          label="The number of inference steps"
          variant="outlined"
          fullWidth
          type="number"
          onChange={(ev) => handleChange('input.num_inference_steps', ev.target.value)}
        />
        <TextField
          select
          label="Формат вывода"
          onChange={(ev) => handleChange('input.output_format', ev.target.value)}
          value={formData.input.output_format}
        >
          {outputFormat.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Если установить значение true, функция будет ждать генерации и загрузки изображения, прежде чем вернуть ответ. Это увеличит задержку функции, но позволит получить изображение непосредственно в ответе, минуя CDN."
          value={formData.sync_mode}
          onChange={() => handleChange('sync_mode', !formData.sync_mode)}
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Если установлено значение true, проверка безопасности будет включена"
          value={formData.enable_safety_checker}
          onChange={() => handleChange('enable_safety_checker', !formData.enable_safety_checker)}
        />
        <Button variant="contained" type="submit" loading={loading} disabled={!formData.input.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Video src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default QwenImageEditForm;

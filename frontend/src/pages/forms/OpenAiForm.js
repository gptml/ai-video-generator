import React, { useCallback } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, Switch, FormControlLabel, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";
import Video from "../../components/Video";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getProfileRequest } from "../../store/reducers/users";

const types = [
  {
    model: 'sora-2-pro-image-to-video',
    title: 'image-to-video',
  },
  { 
    model: 'sora-2-pro-text-to-video',
    title: 'text-to-video',
  },
]

const frames = ['10', '15'];
const aspectRatios = ['portrait', 'landscape'];
const sizes = ['standard', 'high'];

function OpenAiForm() {

  const [type, setType] = React.useState('image-to-video');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'sora-2-pro-image-to-video',
    title: 'OpenAI',
    input: {
      n_frames: '10',
      aspect_ratio: 'landscape',
      size: 'standard',
      remove_watermark: true
    }
  });


  const dispatch = useDispatch();

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
        {type === 'image-to-video' ? <MuiFileInput
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

        /> : null}
        {type === 'image-to-video' ? <TextField
          select
          label="Соотношение сторон"
          defaultValue="portrait"
          helperText="Пожалуйста, выберите соотношение сторон"
          onChange={(ev) => handleChange('input.aspect_ratio', ev.target.value)}

        >
          {aspectRatios.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> : null}
        <TextField
          select
          label="Количество кадров"
          defaultValue="10"
          helperText="Количество кадров, которые будут сгенерированы."
          onChange={(ev) => handleChange('input.n_frames', ev.target.value)}

        >
          {frames.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Качество"
          defaultValue="standart"
          helperText="Качество или размер созданного изображения."
          value={formData.input.size}
          onChange={(ev) => handleChange('input.size', ev.target.value)}

        >
          {sizes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Удалить водяные знаки"
          value={formData.input.remove_watermark}
          onChange={() => handleChange('input.remove_watermark', !formData.input.remove_watermark)}
        />

        <Button variant="contained" type="submit" loading={loading} disabled={!formData.input.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Video src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default OpenAiForm;

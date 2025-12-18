import React, { useCallback, useEffect } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { checkStatusRequest, generateVideoRequest, getSingleModelRequest } from "../../store/reducers/generateVideo";
import Video from "../../components/Video";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getProfileRequest } from "../../store/reducers/users";
import { useParams } from "react-router";
import Textarea from "../../components/form/Textarea";
import File from "../../components/form/File";

const types = [{
  model: 'bytedance/v1-pro-fast-image-to-video',
  title: 'image-to-video',
}]

const resolutions = ['720p', '1080p'];
const durations = ['5', '10'];

function ByteDanceForm() {

  const [type, setType] = React.useState('image-to-video');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'bytedance/v1-pro-fast-image-to-video',
    input: {
      duration: '5',
      resolution: '720p',
    }
  });

  const model = useSelector(state => state.generateVideo.singleModel);

  console.log(model, 999)
  const dispatch = useDispatch();
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
        title: model.title
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
  }, [formData, model]);


  return (
    <Wrapper>
      <GenerationTypes
        types={types}
        onClick={handleSetType}
        selectedType={type}
      />
      <Typography variant="h4" sx={{ marginBottom: 2 }}>{model.title}</Typography>
      <p>{model.description}</p>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 600, marginBottom: 10 }}
        onSubmit={handleSubmit}
      >
        <Textarea
          label="Текст"
          required
          onChange={(ev) => handleChange('input.prompt', ev.target.value)}
          value={formData.input.prompt}
          placeholder="введите ваше сообщение"
          hint="Текстовая подсказка, использованная для создания видео."
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
          label="Разрешение"
          defaultValue="720p"
          helperText="Пожалуйста, выберите разрешение"
          onChange={(ev) => handleChange('input.resolution', ev.target.value)}

        >
          {resolutions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Продолжительность"
          defaultValue="5"
          helperText="Пожалуйста, выберите продолжительность"
          onChange={(ev) => handleChange('input.duration', ev.target.value)}

        >
          {durations.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" type="submit" loading={loading} disabled={!formData.input.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Video src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default ByteDanceForm;

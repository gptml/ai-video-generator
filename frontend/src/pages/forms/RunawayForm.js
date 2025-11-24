import React, { useCallback } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, FormControlLabel, Switch } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Video from "../../components/Video";
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";

const types = [
  {
    model: 'runway-duration-5-generate',
    title: 'image-to-video',
  }
]

const aspectRatios = ['16:9', '9:16', '4:3', '3:4', '1:1'];
const durations = ['5', '10'];
const qualities = ['720p', '1080p'];

function ByteDanceForm() {

  const [type, setType] = React.useState('image-to-video');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    aspectRatio: '16:9',
    model: 'runway',
  });

  const dispatch = useDispatch();

  const handleSetType = useCallback((type) => {
    setType(type.title);
    handleChange('generationType', type.model);
    setGeneratedContent('')
  }, [])

  const handleChange = useCallback((key, value) => {
    _.set(formData, key, value);
    setFormData({ ...formData });
  }, [formData])


  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    setLoading(true);

    const { payload } = await dispatch(generateVideoRequest(formData))
    if (payload.error) {
      alert(payload.error)
    }
    if (!payload.taskId) {
      setLoading(false);
      return;
    }

    setState('generating');

    while (true) {
      const data = await dispatch(checkStatusRequest({ taskId: payload.taskId, path: 'api/v1/runway/record-detail' }));

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

    setLoading(false);
  }, [formData]);

  return (
    <Wrapper>
      <GenerationTypes
        types={types}
        onClick={handleSetType}
        selectedType={type}
      />
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
          value={formData.prompt}
          onChange={(ev) => handleChange('prompt', ev.target.value)}
        />
        <MuiFileInput
          label="Файлы"
          variant="outlined"
          fullWidth
          InputProps={{
            inputProps: {
              accept: '.png, .jpeg, .jpg, .webp'
            },
            startAdornment: <AttachFileIcon />,
          }}
          onChange={(file) => handleChange('image', file)}
          value={formData.image}
          getInputText={(file) => file ? file.name : 'Выберите файл'}

        />
        <TextField
          select
          label="Соотношение сторон"
          defaultValue="16:9"
          value={formData.aspectRatio}
          helperText="Пожалуйста, выберите соотношение сторон"
          onChange={(ev) => handleChange('aspectRatio', ev.target.value)}

        >
          {aspectRatios.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Качество"
          defaultValue="720p"
          value={formData.quality}
          onChange={(ev) => handleChange('quality', ev.target.value)}

        >
          {qualities.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Продолжительность"
          defaultValue="5"
          value={formData.duration}
          helperText="Пожалуйста, выберите продолжительность"
          onChange={(ev) => handleChange('duration', ev.target.value)}

        >
          {durations.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" type="submit" loading={loading} disabled={!formData.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Video src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default ByteDanceForm;

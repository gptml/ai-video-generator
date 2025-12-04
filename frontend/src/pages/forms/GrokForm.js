import React, { useCallback } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Video from "../../components/Video";
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";
import { getProfileRequest } from "../../store/reducers/users";

const types = [
  {
    model: 'grok-imagine/image-to-video',
    title: 'image-to-video',
  },
  {
    model: 'grok-imagine/text-to-video',
    title: 'text-to-video',
  },
]

const aspectRatios = ['2:3', '3:2', '1:1'];
const modes = ['fun', 'normal', 'spicy'];

function ByteDanceForm() {

  const [type, setType] = React.useState('image-to-video');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'grok-imagine/image-to-video',
    title:'Grok',
    input: {}
  });

  const dispatch = useDispatch();

  const handleSetType = useCallback((type) => {
    setType(type.title);
    handleChange('model', type.model);
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
          defaultValue="2:3"
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
          label="Mode"
          defaultValue="normal"
          helperText="Please select your mode"
          onChange={(ev) => handleChange('input.mode', ev.target.value)}

        >
          {modes.map((option) => (
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

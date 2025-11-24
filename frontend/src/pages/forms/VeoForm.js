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
    model: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
    title: 'image-to-video',
  },
  {
    model: 'TEXT_2_VIDEO',
    title: 'text-to-video',
  },
]

const aspectRatios = ['16:9', '9:16', 'Auto'];
const modes = ['fun', 'normal', 'spicy'];

function ByteDanceForm() {

  const [type, setType] = React.useState('image-to-video');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    generationType: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
    enableTranslation: true,
    enableFallback: true,
    aspectRatio: 'Auto',
    model: 'veo3',
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
    // const payload = { taskId: '430622386b46e8e3fdeef4097167ad47' }

    if (payload.error) {
      alert(payload.error)
    }
    if (!payload.taskId) {
      setLoading(false);
      return;
    }

    setState('generating');

    while (true) {
      const data = await dispatch(checkStatusRequest({ taskId: payload.taskId, path: 'api/v1/veo/record-info' }));

      const response = data.payload?.response;
      console.log(response, 888)
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
          onChange={(ev) => handleChange('prompt', ev.target.value)}
        />
        {type === 'image-to-video' ? <MuiFileInput
          label="Файлы"
          variant="outlined"
          fullWidth
          InputProps={{
            inputProps: {
              accept: '.png, .jpeg, .jpg, .webp'
            },
            startAdornment: <AttachFileIcon />,
          }}
          helperText="максимум две фотографии"
          multiple
          onChange={(file) => handleChange('images', file)}
          value={formData.images}
          getInputText={(file) => file ? file.name : 'Выберите файл'}

        /> : null}
        {type === 'image-to-video' ? <TextField
          select
          label="Соотношение сторон"
          defaultValue="Auto"
          helperText="Пожалуйста, выберите соотношение сторон"
          onChange={(ev) => handleChange('aspectRatio', ev.target.value)}

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
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="включить перевод"
          value={formData.enableTranslation}
          onChange={() => handleChange('enableTranslation', !formData.enableTranslation)}
        />

        <FormControlLabel
          control={<Switch defaultChecked />}
          label="включить откат"
          value={formData.enableFallback}
          onChange={() => handleChange('enableFallback', !formData.enableFallback)}
        />

        <Button variant="contained" type="submit" loading={loading} disabled={!formData.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Video src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default ByteDanceForm;

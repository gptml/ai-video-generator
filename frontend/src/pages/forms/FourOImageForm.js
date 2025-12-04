import React, { useCallback } from 'react';
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, FormControlLabel, Switch, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Video from "../../components/Video";
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";
import { getProfileRequest } from "../../store/reducers/users";


const aspectRatios = ['1:1', '3:2', '2:3'];
const nVariants = [1, 2, 4];
const fallbackModels = ['GPT_IMAGE_1', 'FLUX_MAX'];

function FourOImageForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    aspectRatio: '1:1',
    model: 'generate4O',
    title: '4o Image',
    nVariants: 1,
    fallbackModel: 'FLUX_MAX',
    isEnhance: false,
    enableFallback: false,
    uploadCn: false,
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
        path: 'api/v1/gpt4o-image/record-info',
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
      await dispatch(getProfileRequest());
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

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
          label="nVariants"
          defaultValue="1"
          value={formData.nVariants}
          onChange={(ev) => handleChange('nVariants', ev.target.value)}

        >
          {nVariants.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Включить откат"
          value={formData.enableFallback}
          onChange={() => handleChange('enableFallback', !formData.enableFallback)}
        />

        <TextField
          select
          label="Резервная модель"
          value={formData.fallbackModel}
          onChange={(ev) => handleChange('fallbackModel', ev.target.value)}

        >
          {fallbackModels.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>


        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Усиливать"
          value={formData.isEnhance}
          onChange={() => handleChange('isEnhance', !formData.isEnhance)}
        />

        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Загрузить Cn"
          value={formData.uploadCn}
          onChange={() => handleChange('uploadCn', !formData.uploadCn)}
        />


        <Button variant="contained" type="submit" loading={loading} disabled={!formData.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Video src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default FourOImageForm;

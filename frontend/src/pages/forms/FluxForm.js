import React, { useCallback } from 'react';
import GenerationTypes from "../../components/GenerationTypes";
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input';
import _ from 'lodash';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";
import { getProfileRequest } from "../../store/reducers/users";
import Image from "../../components/Image";

const types = [
  {
    model: 'flux-2/flex-image-to-image',
    title: 'image-to-image',
  },
  {
    model: 'flux-2/flex-text-to-image',
    title: 'text-to-image',
  },
]

const aspectRatios = [
  "1:1",
  "4:3",
  "3:4",
  "16:9",
  "9:16",
  "3:2",
  "2:3",
  "auto"
];
const resolutions = ['1K', '2K'];

function FluxForm() {

  const [type, setType] = React.useState('image-to-image');
  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'flux-2/flex-image-to-image',
    title: 'Flux',
    input: { resolution: '1K', aspect_ratio: '1:1' }
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
    // const payload = { taskId: '7863c2b01f0d22676521eb3df67bf28d' }
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
      console.log(response, 8888)
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
        {type === 'image-to-image' ? <MuiFileInput
          label="Файл"
          variant="outlined"
          fullWidth
          InputProps={{
            inputProps: {
              accept: '.png, .jpeg, .jpg, .webp'
            },
            startAdornment: <AttachFileIcon />
          }}
          multiple
          onChange={(file) => handleChange('images', file)}
          value={formData.images}
          getInputText={(files) => {
            if (!files?.length) return "Choose files...";
            const totalSize = files.reduce((sum, f) => sum + f.size, 0);
            return `${files.length} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`;
          }}

        /> : null}
        <TextField
          select
          label="Соотношение сторон"
          defaultValue="1:1"
          helperText="Пожалуйста, выберите соотношение сторон"
          onChange={(ev) => handleChange('input.aspect_ratio', ev.target.value)}

        >
          {aspectRatios.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Разрешение"
          defaultValue="1K"
          value={formData.input.resolution}
          onChange={(ev) => handleChange('input.resolution', ev.target.value)}

        >
          {resolutions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" type="submit" loading={loading} disabled={!formData.input.prompt}>Генерация</Button>

      </Box>
      {generatedContent ? <Image src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default FluxForm;

import React, { useCallback } from 'react';
import Wrapper from "../../components/Wrapper";
import { TextField, MenuItem, Button, Box } from "@mui/material";
import _ from 'lodash';
import { useDispatch } from "react-redux";
import { checkStatusRequest, generateVideoRequest } from "../../store/reducers/generateVideo";
import Audio from "../../components/Audio";


const voices = [
  "Rachel",
  "Aria",
  "Roger",
  "Sarah",
  "Laura",
  "Charlie",
  "George",
  "Callum",
  "River",
  "Liam",
  "Charlotte",
  "Alice",
  "Matilda",
  "Will",
  "Jessica",
  "Eric",
  "Chris",
  "Brian",
  "Daniel",
  "Lily",
  "Bill"
];

function ElevenLabsForm() {

  const [state, setState] = React.useState('generating');
  const [loading, setLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [formData, setFormData] = React.useState({
    model: 'elevenlabs/text-to-speech-turbo-2-5',
    input: {
      voice: 'Rachel'
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
      const data = await dispatch(checkStatusRequest({ taskId: payload.taskId, path: 'api/v1/jobs/recordInfo' }));

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

  console.log(formData, 8888)

  return (
    <Wrapper>
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
          onChange={(ev) => handleChange('input.text', ev.target.value)}
        />

        <TextField
          select
          label="Голос"
          value={formData.input.voice}
          onChange={(ev) => handleChange('input.voice', ev.target.value)}

        >
          {voices.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" type="submit" loading={loading} disabled={!formData.input.text}>Генерация</Button>

      </Box>
      {generatedContent ? <Audio src={generatedContent} href={generatedContent} /> : null}
    </Wrapper>
  );
}

export default ElevenLabsForm;

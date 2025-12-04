import React, { useCallback, useEffect } from 'react';
import Wrapper from "../components/Wrapper";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
  TextField,
  Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeTokenCount, changeTokenCountRequest, getAllModelsRequest } from "../store/reducers/generateVideo";
import * as icons from "../data/icons";
import Button from "@mui/material/Button";


function Settings() {

  const dispatch = useDispatch();

  const allModels = useSelector(state => state.generateVideo.allModels);


  useEffect(() => {
    dispatch(getAllModelsRequest())
  }, [])

  const handleCountChange = useCallback((token, id) => {
    dispatch(changeTokenCount({ token, id }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const { payload } = await dispatch(changeTokenCountRequest(allModels))
    console.log(payload)
  }, [allModels])

  return (
    <Wrapper>
      <Paper sx={{ width: 420, p: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <List>
          {allModels.map(model => (
            <ListItem key={model.id}>
              <Avatar src={icons[model.image]} />

              <ListItemText primary={model.title} />

              <Box sx={{ width: 80 }}>
                <TextField
                  type="number"
                  size="small"
                  value={model.token}
                  onChange={(ev) => handleCountChange(ev.target.value, model.id)}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
        <Button size="small" variant="contained" sx={{ marginTop: 2 }} color="primary" onClick={handleSubmit}>
          Изменить
        </Button>
      </Paper>

    </Wrapper>
  );
}

export default Settings;

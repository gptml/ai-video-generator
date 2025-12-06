import axios from "axios";
import GenerationsHistory from "../models/GenerationsHistory.js";
import moment from 'moment';
import Users from "../models/Users.js";
import Models from "../models/Models.js";
import HttpErrors from 'http-errors';

const { KIE_API_KEY } = process.env;

export async function checkGeneratedContent(path, tId, userId, title) {

  const { data } = await axios.get(
    `https://api.kie.ai/${path}?taskId=${tId}`,
    {
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
      }
    }
  )

  const { state, taskId, model, resultJson, failMsg, createTime } = data.data;

  GenerationsHistory.upsert({
    taskId,
    model:model || title,
    state: state || 'generating',
    result: safeJSONParse(resultJson)?.resultUrls[0],
    failMsg,
    createTime,
    userId,
    title,
    expireTime: moment(createTime).add(14, 'days')
  })

  if (['waiting', 'queuing', 'generating'].includes(state)) {
    return { response: 'generating' }
  }
  if (state === 'fail') {
    return { response: 'Generation failed' }
  }
  if (state === 'success') {
    const user = await Users.findOne({ where: { id: userId } });
    const { token } = await Models.findOne({ where: { title } });
    await Users.update(
      { tokens: user.tokens - token },
      { where: { id: userId } }
    );
    return { response: JSON.parse(resultJson) }

  }
}

export async function checkGeneratedContentVeo(path, tId, userId, title) {

  const { data } = await axios.get(
    `https://api.kie.ai/${path}?taskId=${tId}`,
    {
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
      }
    }
  )

  const states = {
    0: 'generating',
    1: 'success',
    2: 'fail',
    3: 'fail',
  }

  const { successFlag, taskId, model, response, failMsg, createTime } = data.data;
  GenerationsHistory.upsert({
    taskId,
    model:model || title,
    state: states[successFlag] || 'generating',
    result: response?.resultUrls[0],
    failMsg,
    userId,
    createTime,
    title,
    expireTime: moment(createTime).add(14, 'days')
  })

  if (successFlag === 0) {
    return { response: 'generating' }
  }
  if (successFlag === 2 || successFlag === 3) {
    return { response: 'Generation failed' }
  }
  if (successFlag === 1) {
    const user = await Users.findOne({
      where: { id: userId },
      rejectOnEmpty: HttpErrors(404, 'Not found'),
    });
    const { token } = await Models.findOne({ where: { title } });

    await Users.update(
      { token: user.token - token },
      { where: { id: userId } }
    );
    return { response: response }

  }
}


function safeJSONParse(str) {
  if (!str || typeof str !== "string") return null;

  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Invalid JSON:", str);
    return null;
  }
}

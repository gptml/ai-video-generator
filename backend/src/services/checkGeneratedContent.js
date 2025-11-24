import axios from "axios";

const { KIE_API_KEY } = process.env;

export async function checkGeneratedContent(path, taskId) {

  const { data } = await axios.get(
    `https://api.kie.ai/${path}?taskId=${taskId}`,
    {
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
      }
    }
  )
  console.log(data)
  if (['waiting', 'queuing', 'generating'].includes(data.data.state)) {
    return { response: 'generating' }
  }
  if (data.data.state === 'fail') {
    return { response: 'Generation failed' }
  }
  if (data.data.state === 'success') {
    return { response: JSON.parse(data.data.resultJson) }

  }
}

export async function checkGeneratedContentVeo(path, taskId) {

  const { data } = await axios.get(
    `https://api.kie.ai/${path}?taskId=${taskId}`,
    {
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
      }
    }
  )
  console.log(data.data.response.resultUrls)
  if (data.data.successFlag === 0) {
    return { response: 'generating' }
  }
  if (data.data.successFlag === 2 || data.data.successFlag === 3) {
    return { response: 'Generation failed' }
  }
  if (data.data.successFlag === 1) {
    return { response: data.data.response }

  }
}


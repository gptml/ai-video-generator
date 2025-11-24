import axios from 'axios';
import { checkGeneratedContent, checkGeneratedContentVeo } from "../services/checkGeneratedContent.js";
import fs from "node:fs";
import path from "node:path";

const { KIE_API_KEY } = process.env;

class VideoGeneratorController {

  static async generateVeo3(req, res, next) {
    try {

      const { prompt, aspectRatio, generationType, enableTranslation, enableFallback } = req.body;
      const { files } = req;
      files.map(file => {
        const targetPath = path.resolve('src/public', file.filename);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
      })

      const imageUrls = files.map(file => `https://${req.headers.host}/public/${file.filename}`)

      const { data } = await axios.post('https://api.kie.ai/api/v1/veo/generate', {
        prompt,
        model: "veo3_fast",
        imageUrls,
        aspectRatio,
        generationType,
        enableTranslation,
        enableFallback
      }, {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(data)
      if (data.code === 200) {
        console.log('Task submitted:', data);
        res.json({
          taskId: data.data.taskId
        })
      } else {
        console.error('Request failed:', data.msg || 'Unknown error');
        res.json({
          error: data.msg
        })
      }
    } catch (error) {
      console.error('Error:', error.message);
      next(error);
    }
  }

  static async generateRunaway(req, res, next) {
    try {

      const { prompt, aspectRatio, duration, quality } = req.body;
      const { file } = req;
      const targetPath = path.resolve('src/public', file.filename);
      fs.copyFileSync(file.path, targetPath);
      fs.unlinkSync(file.path);

      const { data } = await axios.post('https://api.kie.ai/api/v1/runway/generate', {
        prompt,
        model: "runway-duration-5-generate",
        imageUrl: `https://${req.headers.host}/public/${file.filename}`,
        aspectRatio,
        duration,
        quality,
      }, {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (data.code === 200) {
        console.log('Task submitted:', data);
        res.json({
          taskId: data.data.taskId
        })
      } else {
        console.error('Request failed:', data.msg || 'Unknown error');
        res.json({
          error: data.msg
        })
      }
    } catch (error) {
      console.error('Error:', error.message);
      next(error);
    }
  }

  static async generateOtherModel(req, res, next) {
    try {
      const { input } = req.body;
      const { model } = req.params;
      const { file } = req;
      if (file) {
        // files.map(file => {
        const targetPath = path.resolve('src/public', file.filename);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
        // })
      }


      const { data } = await axios.post('https://api.kie.ai/api/v1/jobs/createTask', {
        model: model.replace('_', '/'),
        input: {
          ...input,
          image_url: file ? `https://${req.headers.host}/public/${file.filename}` : undefined
        },
      }, {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (data.code === 200) {
        console.log('Task submitted:', data);
        res.json({
          taskId: data.data.taskId
        })
      } else {
        console.error('Request failed:', data.msg || 'Unknown error');
        res.json({
          error: data.msg

        })
      }
    } catch (err) {
      next(err);
    }
  }

  static async checkContent(req, res, next) {
    try {
      const { taskId, path } = req.query;
      if (path === 'api/v1/veo/record-info'){
        const data = await checkGeneratedContentVeo(path, taskId)
        res.json(data)
      }
      const data = await checkGeneratedContent(path, taskId)
      res.json(data)

    } catch (error) {
      console.error('Error:', error.message);
      next(error);
    }
  }

}

export default VideoGeneratorController;

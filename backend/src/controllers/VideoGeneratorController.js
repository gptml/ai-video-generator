import axios from 'axios';
import { checkGeneratedContent, checkGeneratedContentVeo } from "../services/checkGeneratedContent.js";
import fs from "node:fs";
import path from "node:path";
import { GenerationsHistory, Models } from "../models/index.js";
import Users from "../models/Users.js";

const { KIE_API_KEY } = process.env;

class VideoGeneratorController {

  static async generateVeo3(req, res, next) {
    try {


      const { prompt, aspectRatio, generationType, enableTranslation, enableFallback, title } = req.body;
      const { files } = req;

      const { userId } = req.auth;
      const user = Users.findOne({ id: userId });
      const { token } = await Models.findOne({ where: { title } });

      if (user.tokens < token) {
        res.status(403).send({ tokens: "недостаточно токенов" });
      }
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

  static async generate4O(req, res, next) {
    try {


      const { prompt, size, nVariants, isEnhance, uploadCn, enableFallback, fallbackModel, title } = req.body;
      const { files } = req;

      const { userId } = req.auth;
      const user = Users.findOne({ id: userId });
      const { token } = await Models.findOne({ where: { title } });

      if (user.tokens < token) {
        res.status(403).send({ tokens: "недостаточно токенов" });
      }
      files.map(file => {
        const targetPath = path.resolve('src/public', file.filename);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
      })

      const filesUrl = files.map(file => `https://${req.headers.host}/public/${file.filename}`)

      const { data } = await axios.post('https://api.kie.ai/api/v1/gpt4o-image/generate', {
        prompt,
        model: "veo3_fast",
        filesUrl,
        size,
        nVariants,
        enableFallback,
        isEnhance,
        uploadCn,
        fallbackModel,
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

  static async generateRunaway(req, res, next) {
    try {

      const { prompt, aspectRatio, duration, quality, title } = req.body;
      const { file } = req;

      const { userId } = req.auth;
      const user = Users.findOne({ id: userId });
      const { token } = await Models.findOne({ where: { title } });

      if (user.tokens < token) {
        res.status(403).send({ tokens: "недостаточно токенов" });
      }
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
      const { input, title } = req.body;
      const { model } = req.params;
      const { files } = req;

      const { userId } = req.auth;
      const user = Users.findOne({ id: userId });

      const { token } = await Models.findOne({ where: { title } });

      if (user.tokens < token) {
        res.status(403).send({ tokens: "недостаточно токенов" });
      }

      if (files) {
        files.map(file => {
        const targetPath = path.resolve('src/public', file.filename);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
        })
      }

      const { data } = await axios.post('https://api.kie.ai/api/v1/jobs/createTask', {
        model: model.replace('_', '/'),
        input: {
          ...input,
          image_url: files[0] && !(model === 'nano-banana-pro' || model === 'flux-2/flex-image-to-image') ? `${req.protocol}://${req.headers.host}/public/${files[0].filename}` : undefined,
          image_input: files[0] && model === 'nano-banana-pro' ? files.map(f =>`${req.protocol}://${req.headers.host}/public/${f.filename}`) : undefined,
          input_urls: files[0] && model === 'flux-2/flex-image-to-image' ? files.map(f =>`${req.protocol}://${req.headers.host}/public/${f.filename}`) : undefined,
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
      const { taskId, path, title } = req.query;
      const { userId } = req.auth;


      if (path === 'api/v1/jobs/recordInfo') {
        const data = await checkGeneratedContent(path, taskId, userId, title)
        res.json(data)
      }
      const data = await checkGeneratedContentVeo(path, taskId, userId, title)
      res.json(data)

    } catch (error) {
      console.error('Error:', error.message);
      next(error);
    }
  }


  static async getModelsList(req, res, next) {
    try {
      const models = await Models.findAll({
        order: [['id', 'DESC']]
      });

      res.json({
        models,
      });
    } catch (e) {
      next(e);
    }
  }


  static async changeModelToken(req, res, next) {
    try {
      const { models } = req.body;
      const a = models.map(model => {
        Models.update(
          model,
          { where: { id: model.id } }
        );
      });

      res.json({
        a,
      });
    } catch (e) {
      next(e);
    }
  }


  static async generationHistory(req, res, next) {
    try {
      const { userId, role } = req.auth;
      const { page = 1 } = req.query;
      const limit = 20
      console.log(req.auth)
      // const history = GenerationsHistory.findOne({ userId: userId });
      const where = { userId };
      const history = await GenerationsHistory.findAll({
        where: role === 'user' ? where : {},
        limit,
        offset: (page - 1) * limit,
        paranoid: false,
        order: [['createdAt', 'DESC']]
      });

      const total = await GenerationsHistory.count({
        where: role === 'user' ? where : {}
      });


      res.json({
        history,
        total,
        totalPages: Math.ceil(total / limit),
      });

    } catch (error) {
      console.error('Error:', error.message);
      next(error);
    }
  }

}

export default VideoGeneratorController;


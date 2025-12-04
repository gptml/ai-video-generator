import { Op } from 'sequelize';
import Users from '../models/Users.js';
import HttpErrors from "http-errors";
import jwt from "jsonwebtoken";

const { TOKEN_SECRET } = process.env;

class UsersController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        where: {
          email,
          password: Users.passwordHash(password),
        },
        rejectOnEmpty: HttpErrors(403, 'Invalid email or password'),
      });

      if (user.status !== 'active') {
        throw HttpErrors(403, 'Account is not active');
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, TOKEN_SECRET);

      res.json({
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsersList(req, res, next) {
    try {
      const { limit = 20, page = 1, ids = [] } = req.body;

      const where = {
        [Op.and]: [],
      };

      if (ids.length) {
        where[Op.and].push({
          id: { [Op.in]: ids },
        });
      }

      const users = await Users.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        paranoid: false,
      });

      const total = await Users.count({
        where,
      });

      res.json({
        users,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (e) {
      next(e);
    }
  }

  static async registerUser(req, res, next) {
    try {
      const { name, email, status = 'active', password } = req.body;

      const exists = await Users.findOne({
        attributes: ['id'],
        where: {
          email,
        },
      });

      if (exists) {
        throw HttpErrors(422, {
          errors: {
            email: 'Email already exists',
          }
        })
      }

      const user = await Users.create({
        name,
        email,
        status,
        password: Users.passwordHash(password),
        role: 'user',
        tokens: 50,
      });
      const token = jwt.sign({ userId: user.id, role: user.role }, TOKEN_SECRET);

      res.json({
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }


  async createUser(req, res, next) {
    try {
      const { role, name, email, phone, status = 'pending' } = req.body;

      const exists = await Users.findOne({
        attributes: ['id'],
        where: {
          email,
        },
      });

      if (exists) {
        throw HttpErrors(422, {
          errors: {
            email: 'Email already exists',
          }
        })
      }

      const user = await Users.create({
        name,
        email,
        phone,
        status,
        password: '',
        role,
      });

      next.json({
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { name, email, role } = req.body;

      const user = await Users.findOne({
        attributes: ['id'],
        where: {
          id: userId,
        },
        rejectOnEmpty: HttpErrors(404)
      });


      await user.update({
        name,
        email,
        role
      });

      res(null, {
        user,
      });
    } catch (e) {
      res(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      if (userId === '1') {
        throw HttpErrors(403);
      }

      const deleted = await Users.destroy({
        where: {
          id: userId,
        },
        force: true,
      });

      if (!deleted) {
        throw HttpErrors(404);
      }

      res.stat(204).send()
    } catch (e) {
      next(e);
    }
  }

  async getSingleUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await Users.findOne({
        where: {
          id: userId
        },
        rejectOnEmpty: HttpErrors(404),
      });

      res(null, {
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { userId } = req.auth;


      const user = await Users.findOne({
        where: {
          id: userId,
        },
        rejectOnEmpty: HttpErrors(404),
      });

      res.json({
        user,
      })
    } catch (e) {
      next(e);
    }
  }
}

export default UsersController;

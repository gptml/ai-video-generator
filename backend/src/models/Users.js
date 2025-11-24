import { DataTypes, Model } from 'sequelize';
import md5 from 'md5';
import sequelize from '../services/sequelize.js';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET, USER_PASSWORD_SECRET, ADMIN_PASSWORD } = process.env;

class Users extends Model {
  static async sync(args) {
    await super.sync(args);
    const defaults = [{
      id: 1,
      name: 'Admin',
      password: ADMIN_PASSWORD,
      email: 'admin@ai-video.ru',
      status: 'active',
      role: 'admin',
    }];
    await Users.bulkCreate(defaults, {
      ignoreDuplicates: true,
    });
  }

  static verify(token = '') {
    return jwt.verify(token.replace('Bearer ', ''), TOKEN_SECRET);
  }

  static passwordHash(password = '') {
    return md5(md5(password) + USER_PASSWORD_SECRET);
  }
}

Users.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.CHAR(32),
    allowNull: false,
    get() {
      return undefined;
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'active'),
    defaultValue: 'pending',
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return undefined;
    },
  },
  codeExpireAt: {
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      return undefined;
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  }
}, {
  sequelize,
  tableName: 'users',
  modelName: 'users',
  indexes: [
    { fields: ['email'], unique: true },
  ],
});


export default Users;

import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';


class Generaions extends Model {
}

Generaions.init({
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
  tokens: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  tableName: 'generations',
  modelName: 'generations',
});


export default Generaions;

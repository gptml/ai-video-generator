import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';


class GenerationsHistory extends Model {
}

GenerationsHistory.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  taskId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.ENUM('generating', 'success', 'fail', 'waiting'),
    allowNull: false,
  },
  result: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  failMsg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expireTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'generations_history',
  modelName: 'generations_history',
});


export default GenerationsHistory;

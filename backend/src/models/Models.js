import { DataTypes, Model } from "sequelize";
import sequelize from "../services/sequelize.js";

class Models extends Model {

  static async sync(args) {
    await super.sync(args);
    const { default: membersList } = await import('../data/modelsList.json', { with: { type: 'json' } });
    await Models.bulkCreate(
      membersList.map(member => ({
        id: member.id,
        title: member.title,
        description: member.description,
        image: member.image,
        path: member.path,
        label: member.label,
        submodels: member.submodels,
        token: 1,
      })), {
        ignoreDuplicates: true,
      }
    );
  }

}

Models.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  submodels: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'models',
  tableName: 'models',
  indexes: [
    { fields: ['title'], unique: true },
  ]
})

export default Models;

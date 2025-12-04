import * as Models from './models/index.js';

async function migrate() {
  for (const Model of [
    Models.Users,
    Models.Models,
    Models.Generaions,
    Models.GenerationsHistory,
  ]) {
    await Model.sync({ alter: true }).catch(console.error);
  }
}

migrate().catch(console.error);

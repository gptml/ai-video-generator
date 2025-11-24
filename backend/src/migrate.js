import * as Models from './models/index.js';

async function migrate() {
  for (const Model of [
    Models.Users,
  ]) {
    await Model.sync({ alter: true }).catch(console.error);
  }
}

migrate().catch(console.error);

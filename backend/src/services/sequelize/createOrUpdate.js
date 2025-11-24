import { Model } from 'sequelize';

Model.createOrUpdate = async function createOrUpdate(
  options = {
    defaults: {},
    where: {},
  },
) {
  const rows = await this.findOrCreate(options);

  if (rows && rows.length) {
    const { defaults, ...opt } = options;

    opt.returning = true;

    const res = await this.update(defaults, opt);

    if (opt.limit === 1) {
      return res[1][0];
    }
    return res[1];
  }
  return rows;
};

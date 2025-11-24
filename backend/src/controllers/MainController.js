class MainController {
  static index = async (req, res, next) => {
    try {
      const { ip } = req;
      const { default: packageJson } = await import('../../package.json', { with: { type: 'json' } });

      res.json({
        status: 'ok',
        ip,
        version: packageJson.version,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default MainController;

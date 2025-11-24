import HttpError from "http-errors";
import _ from "lodash";

/**
 * @param {string, string[]} checkRole
 */
const checkRole = (checkRole = 'admin') => (req, res, next) => {
  try {
    const { role } = req.auth;
    const checkRoles = _.isArray(checkRole) ? checkRole : [checkRole];

    if (!checkRoles.includes(role)) {
      throw new HttpError(403, 'Forbidden');
    }

    next();
  } catch (err) {
    next(err);
  }
}

export default checkRole;

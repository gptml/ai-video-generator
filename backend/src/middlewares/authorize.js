import HttpErrors from 'http-errors';
import { Users } from "../models/index.js";
import jwt from "jsonwebtoken";

const { TOKEN_SECRET } = process.env;
const EXCLUDE = [
  'GET:/',
  'POST:/users/login',
  'POST:/members/login',
];


async function authorize(req, res, next) {
  try {
    const { method, headers } = req;
    const requestPath = `${req.method}:${req.path}`;

    if (method === 'OPTIONS' || EXCLUDE.includes(requestPath)) {
      next();
      return;
    }
    const token = headers.authorization || '';

    const { memberId, userId, role } = jwt.verify(token.replace('Bearer ', ''), TOKEN_SECRET);

    req.auth = {
      userId,
      memberId,
      role
    }

    next();
  } catch (e) {
    next(e);
  }
}

export default authorize;

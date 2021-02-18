const config = require('./' + process.env.NODE_ENV);

export default class Environment {
  static get API_ORIGIN() {
    return config.API_ORIGIN;
  }
}

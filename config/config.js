
const env = process.env.NODE_ENV || 'env';

const config = require('./config.json');

const configEnv = config[env];
console.log(configEnv,config );
Object.keys(configEnv).forEach( key=> process.env[key] = configEnv[key]);

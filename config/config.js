
const env = process.env.NODE_ENV || 'production';

const config = require('./config.json');

const configEnv = config[env];
console.log(configEnv,env );
Object.keys(configEnv).forEach( key=> process.env[key] = configEnv[key]);

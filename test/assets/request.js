export default config => new Promise(resolve => setTimeout(() => resolve(config.mock), 1000));

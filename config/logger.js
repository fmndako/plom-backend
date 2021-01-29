module.exports = {
  info: (value) => {
    if (process.env.DEBUG === 'true') {
      console.info(`${new Date().toGMTString()} [INFO]:`, value)
    }
  },
  log: (value) => {
    if (process.env.DEBUG === 'true') {
      console.log(`${new Date().toGMTString()} [LOG]:`, value)
    }
  },
  error: (value) => {
    if (process.env.DEBUG === 'true') {
      console.error(`${new Date().toGMTString()} [ERROR]:`, value)
    }
  },

}

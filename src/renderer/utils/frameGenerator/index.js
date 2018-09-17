
const files = require.context('.', false, /\.js$/)
const frames = {}

files.keys().forEach(key => {
    if (key === './index.js') return
    frames[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
  })
  
  export default frames
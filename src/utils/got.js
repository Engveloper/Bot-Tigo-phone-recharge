import got from 'got'
import config from '../config'

const instance = got.extend({
  headers: {
    'x-api-key': config.tigo.apiKey,
  },
  responseType: 'json',
})

export default instance

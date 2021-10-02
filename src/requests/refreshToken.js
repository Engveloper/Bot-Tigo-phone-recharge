import got from 'got'

import config from '../config'

export function refreshToken({ refreshToken, accessToken } = {}) {
  const response = got(config.tigo.refreshTokenEndpoint, {
    headers: {
      'x-api-key': config.tigo.apiKey,
      'x-refresh-token': refreshToken,
      'x-id-token': accessToken,
    },
    throwHttpErrors: false,
    responseType: 'json',
  })

  return response
}

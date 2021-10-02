import got from 'got'

import config from '../config'

export function refreshToken({ refreshToken, accessToken } = {}) {
    const response =  got(config.TIGO_REFRESH_TOKEN_ENDPOINT, {
        headers: {
            'x-api-key': config.TIGO_API_KEY,
            'x-refresh-token': refreshToken,
            'x-id-token': accessToken
        }
    })

    return response
}
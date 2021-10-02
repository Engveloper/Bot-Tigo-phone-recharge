import got from 'got'

import config from "../config"

export async function tigoPing({ accessToken } = {}) {
    const response = await got(config.TIGO_PING_ME_ENDPOINT, {
        headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : undefined
        }
    })

    return response
}
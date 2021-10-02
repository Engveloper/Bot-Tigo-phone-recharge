import fetch from 'node-fetch'

import config from "../config"

export async function tigoPing({ accessToken }) {
    const request = fetch(config.TIGO_PING_ME_ENDPOINT, {
        headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : undefined
        }
    })

    return await request.json()
}
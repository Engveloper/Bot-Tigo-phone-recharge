import got from 'utils/got'

import config from '../config'

export async function tigoPing({ accessToken } = {}) {
  const response = await got(config.tigo.pingMeEndpoint, {
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  })

  return response
}

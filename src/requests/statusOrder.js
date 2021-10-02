import got from 'utils/got'
import { inspect } from 'util'

import config from '../config'

export function statusOrder({ number, orderId, accessToken }) {
  const url = new URL(`${config.tigo.orderStatusEndpoint(number, orderId)}`)
  url.searchParams.set('targetMsisdn', number)
  url.searchParams.set('attempt', 1)
  url.searchParams.set('_format', 'json')

  return got(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) =>
    console.error(
      inspect({ response: error.response }, { depth: null, colors: true })
    )
  )
}

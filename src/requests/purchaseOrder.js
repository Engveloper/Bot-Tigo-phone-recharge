import got from 'utils/got'

import config from '../config'

export function purchaseOrder({ number, orderId, accessToken }) {
  return got
    .put(`${config.tigo.purchaseOrderEndpoint(number, orderId)}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      json: {
        tokenizedCardId: config.card.tokenId,
        cvv: config.card.cvv,
        deviceId: config.tigo.deviceId,
      },
    })
    .catch((error) => console.error({ response: error.response }))
}

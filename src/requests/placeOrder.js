import got from 'utils/got'

import config from '../config'

export function placeOrder({ number, amount, accessToken }) {
  console.log('placeORDER!!!!!!!!!!!!!!!')
  return got
    .post(config.tigo.placeOrderEndpoint(number), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      json: {
        amount,
        accountNumber: number,
        paymentMethod: 'creditCard',
        deviceId: config.tigo.deviceId,
      },
    })
    .catch((err) => console.log({ error: err.response }))
}

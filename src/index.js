import {
  tigoPing,
  refreshToken as refreshTokenRequest,
  placeOrder,
  purchaseOrder,
  statusOrder,
} from './requests'
import { getTigoTokens, updateAccessToken } from './utils'

export default async function main() {
  let { lastAccessToken: accessToken, refreshToken } = getTigoTokens()

  try {
    const res = await tigoPing({ accessToken })
    console.log({ tigoPing: res.body })
  } catch (error) {
    console.log({
      response: JSON.stringify(error.response.body, null, 2),
    })

    if (!accessToken || !refreshToken) {
      console.error(
        'Error: You have to save your initial accessToken and refreshToken in storage.json'
      )
      return Promise.resolve()
    }

    const refreshTokenResponse = await refreshTokenRequest({
      refreshToken,
      accessToken,
    })

    console.log({ refreshTokenResponse })

    if (refreshTokenResponse.statusCode === 200) {
      const {
        body: { body },
      } = refreshTokenResponse

      accessToken = body.IdToken
      updateAccessToken({ accessToken })
    } else {
      console.error('Error: There is an unknown error')
      return Promise.resolve()
    }
  }

  return rechargeMobile({ accessToken })
}

async function rechargeMobile({ accessToken }) {
  const number = `50588995215`
  const rechargeResponse = await placeOrder({
    accessToken,
    amount: '10',
    number,
  })

  console.log({ rechargeResponse, rechargeBody: rechargeResponse.body })
  const orderId = rechargeResponse.body.config.params.purchaseorderId

  if (orderId) {
    const purchaseOrderResponse = await purchaseOrder({
      accessToken,
      orderId,
      number,
    })
    console.log({ purchaseOrderResponse: purchaseOrderResponse.body })

    const statusOrderResponse = await statusOrder({
      accessToken,
      orderId,
      number,
    })
    console.log({ statusOrderResponse: statusOrderResponse.body })
  } else {
    console.error('Error: There is an unknown error')
    return Promise.resolve()
  }
}

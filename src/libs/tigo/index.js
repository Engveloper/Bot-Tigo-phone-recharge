import got from 'got'

/**

 * 
 * 
 * @typedef  TigoHeaders
 * @property {`Bearer ${string}`} authorization - Bearer token
 * @property {string} x-api-key
 * @property {string|undefined} x-refresh-token
 * @property {string|undefined} x-id-token
 */

/** 
 * @example
 ```
 const tigo = new TigoRecharge({ accessToken: '', apiKey: '', deviceId: '' })
  const isValid = await tigo.ping()

  if (!isValid) {
    throw new Error('Token is not valid')
  }

  const order = await tigo.order(``, 10)
  const purchase = await order.purchase('', '')
  console.log({ purchase })
  const confirmation = await order.status()
  console.log({ confirmation })
  ```
*/
export class TigoRecharge {
  #baseurl = 'https://tigoid-api-prod.tigocloud.net'
  /** @type {string} */
  #apiKey = null

  /** @type {string} */
  #deviceId = null

  /** @type {string} */
  #accessToken = null
  /** @type {?TigoHeaders} */
  #headers = null

  /** @protected */
  request = got.extend({
    baseUrl: this.#baseurl,
    responseType: 'json',
    rejectUnauthorized: false,
  })

  /**
   * @typedef {object} TigoOptions
   * @property {string} apiKey
   * @property {string} deviceId
   * @property {string} accessToken
   *
   * @param {TigoOptions} options
   */
  constructor(options) {
    const { apiKey, deviceId, accessToken } = options

    this.#apiKey = apiKey ?? this.#isRequired('apiKey')
    this.#deviceId = deviceId ?? this.#isRequired('deviceId')
    this.#accessToken = accessToken

    this.#updateHeaders({
      authorization: `Bearer ${this.#accessToken}`,
      'x-api-key': this.#apiKey,
    })
  }

  /**
   * @param {string} field - The field not found
   */
  #isRequired(field = 'this') {
    throw new Error(`${field} is required`)
  }

  /**
   * @param {TigoHeaders} headers
   */
  #updateHeaders(headers) {
    this.request = got.extend({
      baseUrl: this.#baseurl,
      headers,
      rejectUnauthorized: false,
    })
  }

  async refresh() {
    const res = await this.request.get('dar/v4/public/auth/refresh-token', {
      headers: {
        'x-refresh-token': this.refreshToken,
        'x-id-token': this.#accessToken,
      },
    })

    if (res.statusCode !== 200) {
      throw new Error(`Refresh token failed: ${res.statusCode}`)
    }

    this.#accessToken = res.body?.IdToken

    this.#updateHeaders({ authorization: `Bearer ${this.#accessToken}` })
  }

  /**
   * Try the access token is expired,
   * if it is `expired`, it will try to refresh the token
   * return `true` is  valid or the token is refreshed successfully
   */
  async ping() {
    try {
      const res = await this.request.post('dar/v4/public/users/me')
      let isRefreshed = !(res.statusCode === 401)

      if (!isRefreshed) {
        await this.refresh()
        isRefreshed = true
      }

      if (res.statusCode !== 200) {
        throw new Error(`Ping failed: ${res.statusCode}`)
      }

      return true
    } catch (e) {
      return false
    }
  }

  /**
   *
   * @param {string} number valid phone number
   * @param {number} amount recharge amount
   */
  async order(number, amount) {
    const url = `api/v2.0/payment/mobile/topups/subscribers/${number}/purchaseorders`
    let orderId = null
    const res = await this.request.post(url, {
      json: {
        amount,
        paymentMethod: 'creditCard',
        deviceId: this.#deviceId,
      },
    })

    if (res.statusCode !== 200) {
      throw new Error(`Order failed: ${res.statusCode}`)
    }

    orderId = res.body.config.params.purchaseorderId

    const status = async () => {
      if (orderId === null) {
        return 'pending'
      }

      const res = await this.request.get(`${url}/${orderId}/status`)

      if (res.statusCode !== 200) {
        return 'fail'
      }

      return 'success'
    }

    const purchase = async (tokenizedCardId, cvv) => {
      const res = await this.request.post(`${url}/${orderId}`, {
        json: {
          tokenizedCardId,
          cvv,
          deviceId: this.#deviceId,
        },
      })

      if (res.statusCode !== 200) {
        throw new Error(`Purchase failed: ${res.statusCode}`)
      }

      return res.body
    }

    return {
      status,
      purchase,
    }
  }
}

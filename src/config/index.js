import dotenv from 'dotenv'

dotenv.config()

const config = {
  tigo: {
    apiKey: process.env.TIGO_API_KEY,
    pingMeEndpoint: process.env.TIGO_PING_ME_ENDPOINT,
    refreshTokenEndpoint: process.env.TIGO_REFRESH_TOKEN_ENDPOINT,
    placeOrderEndpoint: (number) =>
      `${process.env.TIGO_PLACE_ORDER_ENDPOINT}/${number}/purchaseorders`,
    purchaseOrderEndpoint: function (number, orderId) {
      return `${this.placeOrderEndpoint(number)}/${orderId}`
    },
    orderStatusEndpoint: function (number, orderId) {
      return `${this.purchaseOrderEndpoint(number, orderId)}/status`
    },
    deviceId: process.env.DEVICE_ID,
  },
  card: {
    tokenId: process.env.CARD_TOKEN_ID,
    cvv: process.env.CARD_CVV,
  },
}

export default config

import dotenv from 'dotenv'

dotenv.config()

export default {
    TIGO_API_KEY: process.env.TIGO_API_KEY,
    TIGO_PING_ME_ENDPOINT: process.env.TIGO_PING_ME_ENDPOINT,
}
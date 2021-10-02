import config from './config'
import { tigoPing } from './requests'

export default async function main() {
    const res = await tigoPing()
    console.log({ res })
}
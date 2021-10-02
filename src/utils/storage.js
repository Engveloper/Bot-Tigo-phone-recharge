import fs from 'fs'
import path from 'path'

const filePath = path.join(__dirname, '../../storage.json')

function getStorageJson() {
  try {
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const jsonData = JSON.parse(data)
    return jsonData
  } catch (error) {
    console.error({ error: JSON.stringify(error) })
  }

  return {}
}

export function updateAccessToken({ accessToken }) {
  const tigoTokens = getTigoTokens()
  const data = { ...tigoTokens, lastAccessToken: accessToken }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export function getTigoTokens() {
  return getStorageJson()
}

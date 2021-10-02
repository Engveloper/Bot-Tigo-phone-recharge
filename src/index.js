import { tigoPing, refreshToken as refreshTokenRequest } from "./requests";
import { getTigoTokens, updateAccessToken } from "./utils";

export default async function main() {
  try {
    const res = await tigoPing();
    console.log({ res });
  } catch (error) {
    console.log({ error });
    const { lastAccessToken, refreshToken } = getTigoTokens();
    if (!lastAccessToken || !refreshToken) {
      console.error(
        "Error: You have to save your initial accessToken and refreshToken in storage.json"
      );
      return Promise.resolve();
    }

    const refreshTokenResponse = await refreshTokenRequest({
      refreshToken,
      accessToken: lastAccessToken,
    });

    console.log({ refreshTokenResponse: refreshTokenResponse.body });

    if (refreshTokenResponse.statusCode === 200) {
      const {
        body: { body },
      } = refreshTokenResponse;

      updateAccessToken({ accessToken: body.IdToken });
    }
  }
}

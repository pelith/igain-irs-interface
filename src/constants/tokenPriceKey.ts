export enum CoinGeckoApiId {
  ETH = 'ethereum',
  HAKKA = 'hakka-finance',
  USDT = 'tether',
  DAI = 'dai',
  USDC = 'usd-coin',
}

export const TOKEN_PRICE_KEYS: string[] = [CoinGeckoApiId.ETH, CoinGeckoApiId.HAKKA];

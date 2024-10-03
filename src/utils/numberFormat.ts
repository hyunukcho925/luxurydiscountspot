export function roundToThousand(price: number): number {
  return Math.round(price / 1000) * 1000;
}

export function formatPrice(price: number | null, includeCurrency: boolean = true): string {
  if (price === null) return '가격 정보 없음';
  const formattedPrice = price.toLocaleString();
  return includeCurrency ? formattedPrice + '원' : formattedPrice;
}

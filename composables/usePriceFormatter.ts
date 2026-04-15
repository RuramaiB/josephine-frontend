export const usePriceFormatter = () => {
  /**
   * Formats a price based on the category.
   * FUEL category shows 4 decimal places for exactitude (ZERA compliance).
   * RETAIL and other categories show 2 decimal places.
   * @param price - The numeric price to format
   * @param category - The product category (e.g., 'FUEL', 'RETAIL')
   * @returns Formatted price string with USD symbol
   */
  const formatPrice = (price: number | undefined | null, category: string = 'RETAIL'): string => {
    if (price === undefined || price === null) return '$ 0.00'
    
    const precision = category.toUpperCase() === 'FUEL' ? 4 : 2
    return `$ ${price.toFixed(precision)}`
  }

  /**
   * Returns whether a data provider is considered an official/verified source.
   * @param source - The source name (retailer)
   * @returns boolean
   */
  const isVerifiedSource = (source: string | undefined | null): boolean => {
    if (!source) return false
    const s = source.toUpperCase()
    return s.includes('ZERA') || s.includes('GMB') || s.includes('OK ZIMBABWE') || s.includes('TM PICK N PAY')
  }

  return {
    formatPrice,
    isVerifiedSource
  }
}

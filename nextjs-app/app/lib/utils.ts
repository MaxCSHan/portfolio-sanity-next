/**
 * Format a date string into a human-readable format
 */
export function formatDate(dateString: string): string {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString
    
    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    return date.toLocaleDateString('en-US', options)
  }
  
  /**
   * Format a price with currency symbol
   */
  export function formatPrice(amount: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    
    return formatter.format(amount)
  }
  
  /**
   * Calculate the duration between two dates and return it in days
   */
  export function calculateDurationInDays(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(end.getTime() - start.getTime())
    
    // Convert milliseconds to days and add 1 (inclusive)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }
  
  /**
   * Get CSS class for a transportation method
   */
  export function getTransportationClass(method: string): string {
    const classes = {
      walking: 'bg-green-100 border-green-300 text-green-800',
      train: 'bg-blue-100 border-blue-300 text-blue-800',
      subway: 'bg-purple-100 border-purple-300 text-purple-800',
      bus: 'bg-orange-100 border-orange-300 text-orange-800',
      taxi: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      flight: 'bg-sky-100 border-sky-300 text-sky-800',
      ferry: 'bg-cyan-100 border-cyan-300 text-cyan-800',
      other: 'bg-gray-100 border-gray-300 text-gray-800'
    }
    
    return classes[method as keyof typeof classes] || classes.other
  }
  
  /**
   * Truncate a string to a specific length and add ellipsis
   */
  export function truncateString(str: string, maxLength: number = 100): string {
    if (!str || str.length <= maxLength) return str
    
    return `${str.slice(0, maxLength)}...`
  }

  /**
   * Combine class names conditionally
   */
  export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
  }
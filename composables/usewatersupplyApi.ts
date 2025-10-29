// composables/useApi.ts

export interface ApiOptions extends RequestInit {
  params?: Record<string, any>
  requireAuth?: boolean
}

export interface ApiResponse<T = any> {
  data: T | null
  error: Error | null
  status: number
}

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // Get base API URL
  const getBaseUrl = (): string => {
    const baseUrl = config.public.apiBase || config.public.strapi?.url || 'http://localhost:8000'
    return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  }

  // Get authorization headers
  const getHeaders = (requireAuth: boolean = true): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requireAuth) {
      // Try runtime config first, then localStorage
      const token = config.public.token || 
                   (process.client ? localStorage.getItem('access_token') : null)
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Build URL with query parameters
  const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
    const baseUrl = getBaseUrl()
    const url = new URL(endpoint, baseUrl)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  // Generic fetch wrapper
  const fetchApi = async <T = any>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { 
      params, 
      requireAuth = true,
      headers: customHeaders = {},
      ...fetchOptions 
    } = options

    const url = buildUrl(endpoint, params)
    const headers = {
      ...getHeaders(requireAuth),
      ...customHeaders,
    }

    try {
      const response = await $fetch<T>(url, {
        ...fetchOptions,
        headers,
      })

      return {
        data: response,
        error: null,
        status: 200,
      }
    } catch (error) {
      console.error('API Error:', error)
      
      return {
        data: null,
        error: error as Error,
        status: (error as any)?.response?.status || 500,
      }
    }
  }

  // Convenience methods
  const get = <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) => {
    return fetchApi<T>(endpoint, { ...options, method: 'GET' })
  }

  const post = <T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => {
    return fetchApi<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    })
  }

  const put = <T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => {
    return fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(body) 
    })
  }

  const del = <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) => {
    return fetchApi<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // Water Supply specific methods
  const waterSupply = {
    // Get district statistics
    getDistrictStatistics: async (uploadMonth: string) => {
      return get('api/water-supply/statistics/districts/', {
        params: { upload_month: uploadMonth }
      })
    },

    // Get upload summary
    getUploadSummary: async () => {
      return get('api/water-supply/statistics/summary/')
    },

    // Initialize tracking
    initialize: async (uploadMonth: string) => {
      return post('api/water-supply/initialize/', {
        upload_month: uploadMonth
      })
    },

    // Upload data
    upload: async (uploadMonth: string, userUpload: string = 'system') => {
      return post('api/water-supply/upload/', {
        upload_month: uploadMonth,
        user_upload: userUpload
      })
    },

    // Get tracking list
    getTrackingList: async () => {
      return get('api/water-supply/tracking/')
    },

    // Get tracking detail
    getTrackingDetail: async (trackingId: number) => {
      return get(`api/water-supply/tracking/${trackingId}/`)
    }
  }

  return {
    fetchApi,
    get,
    post,
    put,
    del,
    waterSupply,
    getBaseUrl,
    getHeaders,
  }
}
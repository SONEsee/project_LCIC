import { ProductResponse, MetaResponse} from '@/types/product'

export default() => {

    // get strapi url from runtime config
    const config = useRuntimeConfig()
    const STRAPI_URL: string = config.strapi.url

    // get token from cookie
    const token = useCookie('token')

    // headers for strapi api
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
    }

    // const get = async <T>(endpoint: string) => {
    //     return useFetch<T>(`${STRAPI_URL}/${endpoint}?populate=*`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             "Authorization": `Bearer ${token.value}`
    //         },
    //         cache: 'no-cache',
    //     })
    // }

    // Get All Products
    const getProducts = async (page: number, pagesize: number) => {
        return useFetch<ProductResponse & MetaResponse>(`${STRAPI_URL}/products?sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${pagesize}&populate=*`, {
            method: 'GET',
            headers: headers,
            cache: 'no-cache',
        })
    }

    return {
        getProducts
    }

}


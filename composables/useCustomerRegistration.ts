// composables/useCustomerRegistration.ts

import type { CustomerRecord, RegisterResponse, UploadedCustomer, FilterOptions } from '~/types/customer';

export const useCustomerRegistration = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.strapi?.url;

  /**
   * Get authentication token from localStorage
   */
  const getAuthToken = (): string | null => {
    try {
      if (typeof window === 'undefined') {
        return null;
      }
      const token = localStorage.getItem('access_token');
      return token ? token : null;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  };

  /**
   * Register single customer manually with documents
   */
  const registerManualCustomer = async (
    customerData: CustomerRecord,
    documents: { type: string; file: File }[]
  ): Promise<any> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    
    // Add customer data fields
    Object.keys(customerData).forEach(key => {
      const value = customerData[key as keyof CustomerRecord];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Add documents
    documents.forEach((doc, index) => {
      formData.append(`document_${doc.type}`, doc.file);
    });

    try {
      const response = await $fetch(`${baseURL}api/register/customer/manual/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      return response;
    } catch (error: any) {
      console.error('❌ Failed to register customer:', error);
      throw new Error(error.data?.error || error.message || 'Failed to register customer');
    }
  };

  /**
   * Register customers in batch
   * Note: Backend currently supports single document for all customers
   * Will need backend update for per-customer documents
   */
  const registerBatchCustomers = async (
    customers: CustomerRecord[],
    bnkCode: string,
    documents?: Record<number, File>
  ): Promise<RegisterResponse> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create JSON blob for customer data
    const jsonBlob = new Blob([JSON.stringify(customers)], { type: 'application/json' });
    const jsonFile = new File([jsonBlob], 'customers.json', { type: 'application/json' });

    const formData = new FormData();
    formData.append('json_file', jsonFile);
    formData.append('bnk_code', bnkCode);

    // For now, attach first document if available
    // Backend needs update to support multiple documents per customer
    if (documents && Object.keys(documents).length > 0) {
      const firstDoc = documents[0];
      if (firstDoc) {
        formData.append('document_file', firstDoc);
      }
    }

    try {
      const response = await $fetch<any>(`${baseURL}api/register/customer/batch/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // Transform response to expected format
      return {
        total_processed: response.count || 0,
        matched: 0,
        new_records: response.count || 0,
        duplicates_skipped: 0,
        details: customers.map((customer, index) => ({
          customer_id: customer.customer_ID || `Customer ${index + 1}`,
          bnk_code: bnkCode,
          lcic_id: `LCIC-${bnkCode}-${Date.now()}-${index}`,
          status: 'NEW RECORD',
          match_percent: 0,
          action: 'INSERTED'
        }))
      };
    } catch (error: any) {
      console.error('❌ Failed to register batch customers:', error);
      throw new Error(error.data?.error || error.message || 'Failed to register customers');
    }
  };

  /**
   * Get uploaded customers (for member - own data only)
   */
  const getMyCustomers = async (): Promise<UploadedCustomer[]> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await $fetch<any>(`${baseURL}api/register/customer/my-uploads/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle response format from Django backend
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          ind_sys_id: item.ind_sys_id,
          customer_id: item.customer_id || item.ind_national_id,
          bnk_code: item.bnk_code,
          lcic_id: item.lcic_id || `LCIC-${item.bnk_code}-${item.ind_sys_id}`,
          status: item.status || 'pending',
          uploaded_at: item.insert_date,
          document_file: item.document_file,
          confirmed: item.is_confirmed || false,
          ind_name: item.ind_name,
          ind_surname: item.ind_surname,
          ind_national_id: item.ind_national_id
        }));
      }
      
      return [];
    } catch (error: any) {
      console.error('❌ Failed to fetch my customers:', error);
      throw new Error(error.data?.error || 'Failed to fetch customers');
    }
  };

  /**
   * Get all uploaded customers (for admin)
   */
  const getAllCustomers = async (filters?: FilterOptions): Promise<UploadedCustomer[]> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.bnk_code) queryParams.append('bnk_code', filters.bnk_code);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.date_from) queryParams.append('date_from', filters.date_from);
      if (filters?.date_to) queryParams.append('date_to', filters.date_to);
      if (filters?.confirmed !== undefined) queryParams.append('confirmed', filters.confirmed.toString());
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `${baseURL}api/register/customer/all-uploads/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await $fetch<any>(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle various response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.results)) {
        return response.results;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected API response format:', response);
        return [];
      }
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      throw new Error(error.data?.message || 'Failed to load customers');
    }
  };

  /**
   * Upload document for a customer
   */
  const uploadDocument = async (customerId: number, file: File): Promise<void> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      await $fetch(`${baseURL}api/register/customer/${customerId}/upload-document/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
    } catch (error: any) {
      console.error('❌ Failed to upload document:', error);
      throw new Error(error.data?.error || 'Failed to upload document');
    }
  };

  /**
   * Confirm customers (admin only)
   */
  const confirmCustomers = async (ids: number[]): Promise<any> => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('No customers selected for confirmation');
    }

    const validIds = ids
      .filter(id => Number.isInteger(id) && id > 0)
      .map(id => Number(id));

    if (validIds.length === 0) {
      throw new Error('No valid customer IDs provided');
    }

    try {
      const response = await $fetch(
        `${config.public.apiBase}/api/register/customer/confirm/`, 
        {
          method: 'POST',
          body: { ids: validIds },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useCookie('access_token').value}`
          }
        }
      );

      return response;

    } catch (error: any) {
      const enhancedError = new Error(
        error?.data?.error || 
        error?.message || 
        'Failed to confirm customers'
      );
      
      (enhancedError as any).status = error?.status;
      (enhancedError as any).statusCode = error?.statusCode;
      (enhancedError as any).data = error?.data;
      
      throw enhancedError;
    }
  };

  /**
   * Parse JSON file to CustomerRecord array
   */
  const parseUploadedFile = async (file: File): Promise<CustomerRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (!Array.isArray(data)) {
            reject(new Error('File must contain an array of customer records'));
            return;
          }
          
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid file format. Please upload a valid JSON file.'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    registerManualCustomer,
    registerBatchCustomers,
    getMyCustomers,
    getAllCustomers,
    uploadDocument,
    confirmCustomers,
    parseUploadedFile
  };
};
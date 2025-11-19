// composables/useCustomerRegistration.ts

export const useCustomerRegistration = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.strapi?.url;

  const getAuthToken = (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('access_token');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  };

  /**
   * Register single customer manually with documents
   * FIXED: Matches backend API expectations exactly
   */
  const registerManualCustomer = async (
    customerData: any,
    documents: { type: string; file: File }[]
  ): Promise<any> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    
    // CRITICAL: Add all fields exactly as backend expects (all lowercase)
    const fieldsMap = {
      'custype': customerData.custype,
      'segment': customerData.segment,
      'bnk_code': customerData.bnk_code,
      'bank_branch': customerData.bank_branch,
      'customer_id': customerData.customer_id,
      'ind_national_id': customerData.ind_national_id,
      'ind_national_id_date': customerData.ind_national_id_date,
      'ind_passport': customerData.ind_passport,
      'ind_passport_date': customerData.ind_passport_date,
      'ind_familybook': customerData.ind_familybook,
      'ind_familybook_prov_code': customerData.ind_familybook_prov_code,
      'ind_familybook_date': customerData.ind_familybook_date,
      'ind_birth_date': customerData.ind_birth_date,
      'ind_name': customerData.ind_name,
      'ind_surname': customerData.ind_surname,
      'ind_lao_name': customerData.ind_lao_name,
      'ind_lao_surname': customerData.ind_lao_surname,
      'description': customerData.description
    };

    // Add only non-empty values
    Object.entries(fieldsMap).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Add documents with exact backend field names
    documents.forEach((doc) => {
      if (doc.file) {
        formData.append(`document_${doc.type}`, doc.file, doc.file.name);
      }
    });

    // Debug log
    console.log('Sending to API:', {
      url: `${baseURL}api/register/customer/manual/`,
      fields: Object.fromEntries(formData.entries()).toString(),
      documentCount: documents.length
    });

    try {
      const response = await $fetch(`${baseURL}api/register/customer/manual/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser handle multipart/form-data boundary
        },
        body: formData
      });

      console.log('API Response:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ API Error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to register customer';
      
      if (error.data) {
        if (error.data.error) {
          errorMessage = error.data.error;
        } else if (error.data.errors) {
          // Handle validation errors
          const errors = error.data.errors;
          errorMessage = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
        } else if (error.data.message) {
          errorMessage = error.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  /**
   * STEP 1: Upload and validate batch JSON file
   * Returns validated customer list for document attachment
   */
  const validateBatchFile = async (
    file: File,
    bnkCode: string
  ): Promise<any> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('json_file', file);
    formData.append('bnk_code', bnkCode);

    try {
      const response = await $fetch<any>(`${baseURL}api/register/customer/batch/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Batch validation response:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Batch validation error:', error);
      const errorMessage = error.data?.error || error.data?.message || error.message || 'Failed to validate batch file';
      throw new Error(errorMessage);
    }
  };

  /**
   * STEP 2: Submit all customers with their documents
   */
  const finalizeBatchUpload = async (
    customersData: any[],
    documents: Record<number, File>
  ): Promise<any> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    
    // Add customer data as JSON string
    formData.append('customers_data', JSON.stringify(customersData));
    
    // Add each document file with index
    Object.entries(documents).forEach(([index, file]) => {
      formData.append(`document_${index}`, file, file.name);
    });

    try {
      const response = await $fetch<any>(`${baseURL}api/register/customer/batch/finalize/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Batch finalize response:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Batch finalize error:', error);
      const errorMessage = error.data?.error || error.data?.message || error.message || 'Failed to submit batch';
      throw new Error(errorMessage);
    }
  };

  /**
 * Update customer segment
 */
const updateCustomerSegment = async (indSysId: number, segment: string): Promise<any> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await $fetch<any>(
      `${baseURL}api/register/customer/update-segment/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          ind_sys_id: indSysId,
          segment: segment
        }
      }
    );

    console.log('Update segment response:', response);
    return response;

  } catch (error: any) {
    console.error('❌ Update segment error:', error);
    throw new Error(
      error?.data?.error || 
      error?.message || 
      'Failed to update segment'
    );
  }
};
  /**
   * Get uploaded customers (for member - own data only)
   */
  const getMyCustomers = async (): Promise<any[]> => {
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

      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          ind_sys_id: item.ind_sys_id,
          customer_id: item.customer_id,
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
  const getAllCustomers = async (): Promise<any[]> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await $fetch<any>(`${baseURL}api/register/customer/all-uploads/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Get all customers response:', response);

      // Handle different response formats
      let customerList = [];
      
      if (Array.isArray(response)) {
        customerList = response;
      } else if (response.success && Array.isArray(response.data)) {
        customerList = response.data;
      } else if (response.results && Array.isArray(response.results)) {
        customerList = response.results;
      } else {
        console.warn('Unexpected response format:', response);
        return [];
      }
      // Transform to consistent format
      return customerList.map((item: any) => ({
        ind_sys_id: item.ind_sys_id,
        customer_id: item.customer_id || item.ind_national_id,
        bnk_code: item.bnk_code,
        bank_branch: item.bank_branch,
        lcic_id: item.lcic_id || `TEMP-${item.ind_sys_id}`,
        status: item.status || 'pending',
        match_percent: item.match_percent || 0,
        uploaded_at: item.insert_date || item.uploaded_at,
        uploaded_by: item.insert_by || item.uploaded_by,
        document_file: item.document_file,
        confirmed: item.is_confirmed || false,
        confirmed_at: item.confirmed_at,
        confirmed_by: item.confirmed_by,
        
        // Personal info
        ind_name: item.ind_name,
        ind_surname: item.ind_surname,
        ind_lao_name: item.ind_lao_name,
        ind_lao_surname: item.ind_lao_surname,
        ind_national_id: item.ind_national_id,
        ind_passport: item.ind_passport,
        ind_familybook: item.ind_familybook,
        ind_birth_date: item.ind_birth_date,
        
        // Computed fields for display
        full_name_en: `${item.ind_name || ''} ${item.ind_surname || ''}`.trim(),
        full_name_la: `${item.ind_lao_name || ''} ${item.ind_lao_surname || ''}`.trim(),
        
        // Keep original for detail view
        ...item
      }));

    } catch (error: any) {
      console.error('❌ Failed to fetch all customers:', error);
      throw new Error(error.data?.error || error.data?.message || 'Failed to load customers');
    }
  };
  /**
   * Confirm customers with matching logic
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

    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      console.log('Confirming customers:', validIds);

      const response = await $fetch<any>(
        `${baseURL}api/register/customer/confirm/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: { ids: validIds }
        }
      );

      console.log('Confirmation response:', response);

      // Show matching summary
      if (response.success && response.details) {
        console.log(`✅ Matched: ${response.matched}, New: ${response.new_records}`);
      }

      return response;

    } catch (error: any) {
      console.error('❌ Confirmation error:', error);
      
      const enhancedError = new Error(
        error?.data?.error || 
        error?.message || 
        'Failed to confirm customers'
      );
      
      (enhancedError as any).status = error?.status || error?.statusCode;
      (enhancedError as any).data = error?.data;
      
      throw enhancedError;
    }
  };
/**
 * Update customer ID for confirmed record (one time only)
 */
const updateCustomerID = async (indSysId: number, newCustomerId: string): Promise<any> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await $fetch<any>(
      `${baseURL}api/register/customer/update-id/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          ind_sys_id: indSysId,
          new_customer_id: newCustomerId
        }
      }
    );

    console.log('Update customer ID response:', response);
    return response;

  } catch (error: any) {
    console.error('❌ Update customer ID error:', error);
    throw new Error(
      error?.data?.error || 
      error?.message || 
      'Failed to update customer ID'
    );
  }
};
  /**
   * Parse JSON file to array
   */
  const parseUploadedFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (!Array.isArray(data)) {
            reject(new Error('File must contain an array'));
            return;
          }
          
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    registerManualCustomer,
    validateBatchFile,      // NEW - Step 1
    finalizeBatchUpload,    // NEW - Step 2
    getAllCustomers,      // ADD THIS
    confirmCustomers,     // ADD THIS
    updateCustomerID,
    updateCustomerSegment,
    getMyCustomers,
    parseUploadedFile
  };
};
export const useUserApi = () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.strapi.url;
  const token = useCookie("access_token").value;


    // Fetch Roles
  const fetchRoles = async () => {
    const { data, error } = await useFetch(`${apiUrl}api/roles/`, { headers });
    if (error.value) throw error.value;
    return data.value;
  };

  // Fetch Member Info
  const fetchMembers = async () => {
    const { data, error } = await useFetch(`${apiUrl}api/memberinfo/`, { headers });
    if (error.value) throw error.value;
    return data.value;
  };
  const createUser = async (payload: any) => {
    const formData = new FormData();

    // Append all form fields
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    }

    console.log("FormData content:");
    for (const [k, v] of formData.entries()) {
      console.log(k, v);
    }

    const response = await fetch(`${apiUrl}api/create_user/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Don't set Content-Type manually!
        Accept: "application/json",
      },
      body: formData,
    });

    // ✅ Explicitly handle non-JSON responses
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Response was not JSON:", text);
      throw new Error("Unexpected server response");
    }
  };

  return { createUser, fetchRoles, fetchMembers  };
};

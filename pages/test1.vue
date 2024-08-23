<template>
  <v-card>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <div class="border">
              <div class="text-center mt-5 ml-5 mb-5 mr-5">
                <img
                  src="../assets/images/com01.jpeg"
                  alt="Image"
                  width="100%"
                  height="100%"
                />
                <h2 class="text-center">ເອກະສານອັບໂຫຼດ</h2>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-col cols="12">
              <v-row>
                <v-form ref="form" lazy-validation @submit.prevent="submitForm" enctype="multipart/form-data" >
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.LCICID"
                    label="ປ້ອນຂໍ້ມູນ LCICID"
                    variant="outlined"
                    :error-messages="errors.LCICID"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.EnterpriseID"
                    label="ປ້ອນຂໍ້ມູນ EnterpriseID"
                    variant="outlined"
                    :error-messages="errors.EnterpriseID"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.enterpriseNameLao"
                    label="ປ້ອນຊື່ວິສາຫະກິດພາສາລາວ"
                    variant="outlined"
                    :error-messages="errors.enterpriseNameLao"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.enterpriseNameEnglish"
                    label="ປ້ອນຊື່ວິສາຫະກິດພາສາອັງກິດ"
                    variant="outlined"
                    :error-messages="errors.enterpriseNameEnglish"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <!-- Add other form fields here -->
                <v-col cols="12" md="6" class="d-flex justify-end align-end text-end">
                  <v-btn
                    color="primary"
                    @click="submitForm"
                    :disabled="loading"
                  >
                    ບັນທຶກ
                  </v-btn>
                  <v-btn color="secondary" @click="resetForm">
                    ຍົກເລີກ
                  </v-btn>
                </v-col></v-form>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    const form = ref({
      LCICID: "",
      EnterpriseID: "",
      enterpriseNameLao: "",
      enterpriseNameEnglish: "",
      RegisCertificateNumber: "",
      RegisDate: "",
      Enlocation: "",
      RegistrationOfficeType: "",
      RegistrationOfficeCode: "",
      EnLegalStructure: "",
      ForeignInvestorFlag: "",
      InvestmentAmount: "",
      InvestmentCurrency: "",
      RepresentativeNationality: "",
    });

    const errors = ref<any>({});
    const loading = ref(false);

    const validateForm = () => {
      const newErrors: any = {};
      if (!form.value.LCICID) newErrors.LCICID = "ກະລຸນາປ້ອນ LCICID";
      if (!form.value.EnterpriseID) newErrors.EnterpriseID = "ກະລຸນາປ້ອນ EnterpriseID";
      if (!form.value.enterpriseNameLao) newErrors.enterpriseNameLao = "ກະລຸນາປ້ອນ Enterprise Lao Name";
      if (!form.value.enterpriseNameEnglish) newErrors.enterpriseNameEnglish = "ກະລຸນາປ້ອນ Enterprise English Name";
      if (!form.value.RegisCertificateNumber) newErrors.RegisCertificateNumber = "ກະລຸນາປ້ອນ RegisCertificateNumber";
      if (!form.value.RegisDate) newErrors.RegisDate = "ກະລຸນາປ້ອນ RegisDate";
      if (!form.value.Enlocation) newErrors.Enlocation = "ກະລຸນາປ້ອນ Enlocation";
      if (!form.value.RegistrationOfficeType) newErrors.RegistrationOfficeType = "ກະລຸນາປ້ອນ RegistrationOfficeType";
      if (!form.value.RegistrationOfficeCode) newErrors.RegistrationOfficeCode = "ກະລຸນາປ້ອນ RegistrationOfficeCode";
      if (!form.value.EnLegalStructure) newErrors.EnLegalStructure = "ກະລຸນາປ້ອນ EnLegalStructure";
      if (!form.value.ForeignInvestorFlag) newErrors.ForeignInvestorFlag = "ກະລຸນາປ້ອນ ForeignInvestorFlag";
      if (!form.value.InvestmentAmount) newErrors.InvestmentAmount = "ກະລຸນາປ້ອນ InvestmentAmount";
      if (!form.value.InvestmentCurrency) newErrors.InvestmentCurrency = "ກະລຸນາປ້ອນ InvestmentCurrency";
      if (!form.value.RepresentativeNationality) newErrors.RepresentativeNationality = "ກະລຸນາປ້ອນ RepresentativeNationality";

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const submitForm = async () => {
      console.log("Submit button clicked");
      if (!validateForm()) {
        return;
      }
      loading.value = true;
      try {
        const response = await axios.post("http://127.0.0.1:35729/api/api/enterprise-info", form.value);
        console.log("Response:", response.data);
        alert("ຂໍ້ມູນຖືກບັນທຶກສຳເລັດ");
        resetForm();
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        alert("ມີບາງຢ່າງຜິດພາດ");
      } finally {
        loading.value = false;
      }
    };

    const resetForm = () => {
      form.value = {
        LCICID: "",
        EnterpriseID: "",
        enterpriseNameLao: "",
        enterpriseNameEnglish: "",
        RegisCertificateNumber: "",
        RegisDate: "",
        Enlocation: "",
        RegistrationOfficeType: "",
        RegistrationOfficeCode: "",
        EnLegalStructure: "",
        ForeignInvestorFlag: "",
        InvestmentAmount: "",
        InvestmentCurrency: "",
        RepresentativeNationality: "",
      };
      errors.value = {};
    };

    return {
      form,
      errors,
      loading,
      submitForm,
      resetForm,
    };
  },
});
</script>

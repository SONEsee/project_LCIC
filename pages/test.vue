<template>
  <v-card>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <div class="border">
              <div class="text-center mt-5 ml-5 mb-5 mr-5">
                <!-- <img
                  src="../assets/images/com01.jpeg"
                  alt="Image"
                  width="100%"
                  height="100%"
                /> -->
                <v-container>
                  <img width="100%"
                  height="100%"  :src="fullImagePath" alt="Uploaded Image" />
                </v-container>
                <h2 class="text-center">ເອກະສານອັບໂຫຼດ</h2>
              </div>
            </div></v-card
          >
        </v-col>
        <v-col cols="12" md="4">
          <div
            class="border d-flex align-center justify-center"
            style="height: 300px"
          >
            <p style="font-size: 200%">ລົງຂໍ້ມູນວິສາຫະກິດ</p>
          </div>
          <v-card>
            <div>
              <v-col cols="12">
                <v-row>
                  <v-sheet class="mx-auto" max-width="">
                    <v-form validate-on="submit lazy" @submit.prevent="submit">
                      <v-col cols="12">
                        <v-row>
                          <!-- <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="LCICID"
                              :rules="rules"
                              hint="ປອ້ນຂໍ້ມູນ LCICID"
                              label="ປອ້ນຂໍ້ມູນ LCICID"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col> -->
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="LCICID"
                              :rules="rules"
                              hint="ປອ້ນຂໍ້ມູນ LCICID"
                              label="ປອ້ນຂໍ້ມູນ LCICID"
                              variant="outlined"
                              persistent-hint
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="EnterpriseID"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ EnterpriseID"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="enterpriseNameLao"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Enterprise lao Name"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="eneterpriseNameEnglish"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Enterprise English Name"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="regisCertificateNumber"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ RegisCertificateNumber"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="regisDate"
                              :rules="rules"
                              type="date"
                              
                              label="ປອ້ນຂໍ້ມູນ RegisDate"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="enLocation"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Enlocation"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="regisStrationOfficeType"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Regis Stration Office Type"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="regisStationOfficeCode"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Regis Stration Office Code"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="enLegalStrature"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ EnLegal Strature"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="foreigninvestorFlag"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Foreigninbvestor Flag"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="investmentAmount"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Investment Amount"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="investmentCurrency"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Investment Currency"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>
                          <v-col cols="12" md="6"
                            ><v-text-field
                              v-model="representativeNationality"
                              :rules="rules"
                              
                              label="ປອ້ນຂໍ້ມູນ Representative Nationaly"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-col>

                          <v-col cols="12" md="6"></v-col>
                        </v-row>
                      </v-col>
                      <v-vol class="text-center">
                        <v-row>
                          <v-col cols="6" md="6"
                            ><v-btn
                            style="width:100px ;"
                              :loading="loading"
                              class="bg-green"
                              text="ບັນທຶກ"
                              type="submit"
                              block
                              :disabled="!isFormValid"
                            ></v-btn
                          ></v-col>
                          <v-col cols="6" md="6"
                            ><v-btn
                            style="width:100px ;"
                              :loading="loading"
                              class="bg-red"
                              text="ຍົກເລີກ"
                              type="reset"
                              block
                            ></v-btn
                          ></v-col
                          >
                          
                         
                        </v-row>
                      </v-vol>
                    </v-form>
                  </v-sheet>
                </v-row>
              </v-col>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>
<script lang="ts">
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  setup() {
    useHead({
      title: "Upload File",
      meta: [
        { name: "keywords", content: "Report, Nuxt 3, Backend" },
        {
          name: "Description",
          content: "Report Nuxt 3, IT Genius Engineering",
        },
      ],
    });
    definePageMeta({
      layout: "backend",
    });
    const loading = ref(false);

    const enterpriseNameLao = ref<string>("");
    const eneterpriseNameEnglish = ref<string>("");
    const regisStationOfficeCode = ref<string>("");

    const enLegalStrature = ref<string>("");
    const foreigninvestorFlag = ref<string>("");
    const investmentAmount = ref<string>("");
    const investmentCurrency = ref<string>("");
    const representativeNationality = ref<string>("");
    const regisCertificateNumber = ref<string>("");
    const regisDate = ref<string>("");
    const enLocation = ref<string>("");

    const regisStrationOfficeType = ref<string>("");
    const EnterpriseID = ref<string>("");
    const LCICID = ref<string>("");

    const rules = [
      (value: string) => !!value || "Required.",
      (value: string) => (value && value.length >= 3) || "Min 3 characters",
    ];

    const submit = async () => {
      loading.value = true;
      try {
        const csrfToken = Cookies.get("csrftoken");

        let regisDateFormatted = null;
        if (regisDate.value) {
          const dateObject = new Date(regisDate.value);
          if (!isNaN(dateObject.getTime())) {
            regisDateFormatted = dateObject.toISOString();
          } else {
            throw new Error("Invalid date format for regisDate");
          }
        }

        const investmentAmountFormatted = parseFloat(investmentAmount.value);

        const response = await axios.post(
          "http://127.0.0.1:35729/api/api/enterprise-info/",
          {
            enterpriseNameLao: enterpriseNameLao.value,
            eneterpriseNameEnglish: eneterpriseNameEnglish.value,
            enLegalStrature: enLegalStrature.value,
            foreigninvestorFlag: foreigninvestorFlag.value,
            investmentAmount: investmentAmountFormatted,
            investmentCurrency: investmentCurrency.value,
            representativeNationality: representativeNationality.value,
            regisCertificateNumber: regisCertificateNumber.value,
            regisDate: regisDateFormatted,
            enLocation: enLocation.value,
            regisStationOfficeCode: regisStationOfficeCode.value,
            regisStrationOfficeType: regisStrationOfficeType.value,
            EnterpriseID: EnterpriseID.value,
            LCICID: LCICID.value,
          },
          {
            headers: {
              "X-CSRFToken": csrfToken || "",
            },
          }
        );

        Swal.fire({
          title: "ສຳເລັດ!",
          text: "ສ້າງຂໍ້ມູນວິສາຫະກິດສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error creating enterprise info:", error);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.message || "ລົ້ມເຫລວໃນການສ້າງຂໍ້ມູນວິສາຫະກິດ.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        loading.value = false;
      }
    };
    const route = useRoute();
    const isFormValid = computed(() => {
  return (
    enterpriseNameLao.value.trim() !== "" &&
    eneterpriseNameEnglish.value.trim() !== "" &&
    regisCertificateNumber.value.trim() !== "" &&
    regisDate.value.trim() !== "" &&
    enLocation.value.trim() !== "" &&
    regisStrationOfficeType.value.trim() !== "" &&
    regisStationOfficeCode.value.trim() !== "" &&
    enLegalStrature.value.trim() !== "" &&
    foreigninvestorFlag.value.trim() !== "" &&
    investmentAmount.value.trim() !== "" &&
    investmentCurrency.value.trim() !== "" &&
    representativeNationality.value.trim() !== "" &&
    EnterpriseID.value.trim() !== "" &&
    LCICID.value.trim() !== ""
  );
});


    const fullImagePath = computed(() => {
      return `http://127.0.0.1:35729/${route.query.image}`;
    });

    // const fetchLastLCICID = async () => {
    //   try {
    //     const response = await axios.get<{ last_lcicid: string }>(
    //       "http://127.0.0.1:35729/api/api/last-lcicid/"
    //     );
    //     LCICID.value = (parseInt(response.data.last_lcicid) + 1).toString();
    //   } catch (error) {
    //     console.error("Error fetching last LCICID:", error);
    //   }
    // };
    // onMounted(fetchLastLCICID);
    const fetchLastLCICID = async () => {
  try {
    const response = await axios.get<{ last_lcicid: string }>(
      "http://127.0.0.1:35729/api/api/last-lcicid/"
    );
    LCICID.value = (parseInt(response.data.last_lcicid) + 1).toString();
  } catch (error) {
    console.error("Error fetching last LCICID:", error);
  }
};

    onMounted(fetchLastLCICID);
    return {
      loading,
      EnterpriseID,
      LCICID,
      enterpriseNameLao,
      eneterpriseNameEnglish,
      regisCertificateNumber,
      regisDate,
      enLocation,
      regisStrationOfficeType,
      regisStationOfficeCode,

      enLegalStrature,
      foreigninvestorFlag,
      investmentAmount,
      investmentCurrency,
      representativeNationality,
      fullImagePath,

      isFormValid,
      rules,
      submit,
    };
  },
});
</script>

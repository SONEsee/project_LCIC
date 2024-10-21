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
                  <img
                    width="100%"
                    height="100%"
                    :src="fullImagePath"
                    alt="Uploaded Image"
                  />
                </v-container>
                <h2 class="text-center">ເອກະສານອັບໂຫຼດ</h2>
              </div>
            </div></v-card
          >
        </v-col>
        <v-col cols="12" md="4">
          <div
            class="border d-flex align-center justify-center"
            style="height: 100px"
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
                          <v-div
                            cols="12"
                            class="d-flex justify-center mt-5"
                            style="margin-bottom: 8px; width: 100%"
                            ><v-text-field
                              v-model="EnterpriseID"
                              :rules="rules"
                              label=" ລະຫັດວິສາຫະກິດ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-div>
                          <v-div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                            ><v-text-field
                              v-model="enterpriseNameLao"
                              :rules="rules"
                              label=" ຊື່ວິສາຫະກິດ (ພາສາລາວ)"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-div>
                          <v-div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                            ><v-text-field
                              v-model="eneterpriseNameEnglish"
                              :rules="rules"
                              label=" ຊື່ວິສາຫະກິດ (ພາສາອັງກິດ)"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field
                          ></v-div>
                          <div cols="12" style="width: 100%">
                            <v-text-field
                              v-model="regisCertificateNumber"
                              :rules="rules"
                              label=" ເລກທີ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          <div cols="12" style="width: 100%">
                            <v-text-field
                              v-model="regisDate"
                              :rules="rules"
                              type="date"
                              label=" ລົງວັນທີ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          <div cols="12" style="width: 100%">
                            <!-- <v-autocomplete
                              v-model="enLocation"
                              :rules="rules"
                              label=" ທີ່ຕັ້ງ"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete> -->

                            <v-autocomplete
                              v-model="enLocation"
                              :items="villages"
                              item-text="title"
                              item-value="id"
                              label="ກະລຸນາເລືອກບ້ານ"
                              variant="outlined"
                              @input="handleVillageSelect"
                            ></v-autocomplete>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-text-field
                              v-model="regisStrationOfficeType"
                              :rules="rules"
                              label=" Regis Stration Office Type"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-autocomplete
                              v-model="regisStationOfficeCode"
                              :items="regisStationOfficeCodes"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="ຂັ້ນຫອ້ງການຂື້ນທະບຽນ"
                              variant="outlined"
                              persistent-hint
                            >
                            </v-autocomplete>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-select
                              v-model="enLegalStrature"
                              :rules="rules"
                              :items="enLegalStratures"
                              item-text="title"
                              item-value="id"
                              label=" ຮູບແບບວິສາຫະກິດ"
                              variant="outlined"
                              persistent-hint
                            ></v-select>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-select
                              v-model="foreigninvestorFlag"
                              :items="foreigninvestorFlags"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label=" Foreigninbvestor Flag"
                              variant="outlined"
                              persistent-hint
                            ></v-select>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-text-field
                              v-model="investmentAmount"
                              :rules="rules"
                              type="number"
                              label=" ທຶນຈົດທະບຽນ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-autocomplete
                              v-model="investmentCurrency"
                              :items="investmentCurrencys"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label=" Investment Currency"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
                          </div>
                          <div
                            cols="12"
                            style="margin-bottom: 8px; width: 100%"
                          >
                            <v-autocomplete
                              v-model="representativeNationality"
                              :items="representativeNationalitys"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label=" Representative Nationaly"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
                          </div>

                          <v-col cols="12" md="6"></v-col>
                        </v-row>
                      </v-col>
                      <v-vol class="text-center">
                        <v-row>
                          <v-col cols="6" md="6"
                            ><v-btn
                              style="width: 100px"
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
                              style="width: 100px"
                              :loading="loading"
                              class="bg-red"
                              text="ຍົກເລີກ"
                              type="reset"
                              :to="{ name: 'insertcollaterals' }"
                              block
                            ></v-btn
                          ></v-col>
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
  data() {
    return {
      regisStationOfficeCode: 1,
      enLegalStrature: 1,
      foreigninvestorFlag: 1,
      investmentCurrency: 1,
      representativeNationality: 1,
      enLegalStratures: [
        { id: 411, title: "ວິສາຫະກິດ ສ່ວນບຸກຄົນ" },
        { id: 422, title: "ວິສາຫະກິດ ຮຸ້ນສ່ວນສາກົນ" },
        { id: 432, title: "ວິສາຫະກິດ ຮຸ້ນສ່ວນ ຈຳກັດ" },
        { id: 442, title: "ບໍລິສັດ ຈຳກັດ" },
        { id: 451, title: "ບໍລິສັດ ຈຳກັດຜູ້ດຽວ" },
        { id: 469, title: "ບໍລິສັດ ມະຫາຊົນ" },
        { id: 479, title: "ບໍລິສັດ ລັດ" },
        { id: 485, title: "ບໍລິສັດ ປະສົມ" },
        { id: 499, title: "ວິສາຫະກິດລວມໝູ່" },
      ],
      representativeNationalitys: [
        { id: "AF", title: "AF" },
        { id: "AO", title: "AO" },
        { id: "AT", title: "AT" },
        { id: "AU", title: "AU" },
        { id: "BD", title: "BD" },
        { id: "BE", title: "BE" },
        { id: "BG", title: "BG" },
        { id: "BO", title: "BO" },
        { id: "BR", title: "BR" },
        { id: "CA", title: "CA" },
        { id: "CL", title: "CL" },
        { id: "CM", title: "CM" },
        { id: "CN", title: "CN" },
        { id: "CO", title: "CO" },
        { id: "CY", title: "CY" },
        { id: "CZ", title: "CZ" },
        { id: "DE", title: "DE" },
        { id: "DK", title: "DK" },
        { id: "DM", title: "DM" },
        { id: "DO", title: "DO" },
        { id: "EG", title: "EG" },
        { id: "ER", title: "ER" },
        { id: "FI", title: "FI" },
        { id: "FM", title: "FM" },
        { id: "FR", title: "FR" },
        { id: "GE", title: "GE" },
        { id: "GH", title: "GH" },
        { id: "GT", title: "GT" },
        { id: "HN", title: "HN" },
        { id: "HR", title: "HR" },
        { id: "HU", title: "HU" },
        { id: "ID", title: "ID" },
        { id: "IL", title: "IL" },
        { id: "IN", title: "IN" },
        { id: "IT", title: "IT" },
        { id: "JP", title: "JP" },
        { id: "KG", title: "KG" },
        { id: "KH", title: "KH" },
        { id: "KN", title: "KN" },
        { id: "KP", title: "KP" },
        { id: "KR", title: "KR" },
        { id: "LA", title: "LA" },
        { id: "LB", title: "LB" },
        { id: "LT", title: "LT" },
        { id: "LU", title: "LU" },
        { id: "LV", title: "LV" },
        { id: "MC", title: "MC" },
        { id: "MM", title: "MM" },
        { id: "MX", title: "MX" },
        { id: "MY", title: "MY" },
        { id: "NG", title: "NG" },
        { id: "NL", title: "NL" },
        { id: "NP", title: "NP" },
        { id: "NZ", title: "NZ" },
        { id: "PA", title: "PA" },
        { id: "PH", title: "PH" },
        { id: "PK", title: "PK" },
        { id: "PL", title: "PL" },
        { id: "PW", title: "PW" },
        { id: "RO", title: "RO" },
        { id: "RS", title: "RS" },
        { id: "RU", title: "RU" },
        { id: "SD", title: "SD" },
        { id: "SE", title: "SE" },
        { id: "SG", title: "SG" },
        { id: "SI", title: "SI" },
        { id: "SN", title: "SN" },
        { id: "SZ", title: "SZ" },
        { id: "TH", title: "TH" },
        { id: "TL", title: "TL" },
        { id: "TM", title: "TM" },
        { id: "TR", title: "TR" },
        { id: "TZ", title: "TZ" },
        { id: "UA", title: "UA" },
        { id: "US", title: "US" },
        { id: "UZ", title: "UZ" },
        { id: "VA", title: "VA" },
        { id: "VN", title: "VN" },
        { id: "VU", title: "VU" },
        { id: "YE", title: "YE" },
        { id: "ZA", title: "ZA" },
      ],
      regisStationOfficeCodes: [
        { id: 1, title: "ຫອ້ງການຂື້ນທະບຽນວິສາຫະກິດຂັ້ນສູງກາງ" },
        { id: 2, title: "ຫອ້ງການຂື້ນທະບຽນວິສາຫະກິດຂັ້ນແຂວງ" },
        { id: 3, title: "ຫອ້ງການຂື້ນທະບຽນວິສາຫະກິດຂັ້ນເມືອງ" },
        { id: 4, title: "ຫອ້ງການສົ່ງເສີມ ແລະ ຄຸ້ມຄອງການລົງທຶນ" },
        { id: 5, title: "ຫອ້ງການເຂດເສດຖະກິດພິເສດ" },
        { id: 6, title: "ຫອ້ງການອຸດສາຫະກຳ ແລະ ການຄ້າ" },
      ],
      foreigninvestorFlags: [
        { id: "M", title: "ການລົງທຶນປະສົມ" },
        { id: "F", title: "ການລົງທຶນຈາກຕ່າງປະເທດ" },
        { id: "L", title: "ການລົງທຶນພາຍໃນ" },
        { id: "NM", title: "ການລົງທຶນຈາກບໍລິສັດຂ້າມຊາດ" },
        { id: "R", title: "ການລົງທຶນຈາກພາກພື້ນອາຊີ" },
        { id: "I", title: "ການລົງທຶນຈາກການຈັດຕັ້ງຂອງສາກົນ" },
        { id: "S", title: "ການລົງທຶນຈາກລັດຖະບານຕ່າງປະເທດ" },
        { id: "P", title: "ການລົງທຶນລະຫວ່າງລັດ, ເອກກະຊົນ ແລະ ຕ່າງປະເທດ" },
      ],
      investmentCurrencys: [
        { id: "LAK", title: "LAK" },
        { id: "THB", title: "THB" },
        { id: "JPY", title: "JPY" },
        { id: "USD", title: "USD" },
        { id: "AFN", title: "AFN" },
        { id: "AOA", title: "AOA" },
        { id: "EUR", title: "EUR" },
        { id: "AUD", title: "AUD" },
        { id: "BDT", title: "BDT" },
        { id: "BGN", title: "BGN" },
        { id: "BOB", title: "BOB" },
        { id: "BRL", title: "BRL" },
        { id: "CAD", title: "CAD" },
        { id: "CLP", title: "CLP" },
        { id: "XAF", title: "XAF" },
        { id: "CNY", title: "CNY" },
        { id: "COP", title: "COP" },
        { id: "CZK", title: "CZK" },
        { id: "DKK", title: "DKK" },
        { id: "XCD", title: "XCD" },
        { id: "DOP", title: "DOP" },
        { id: "EGP", title: "EGP" },
        { id: "ERN", title: "ERN" },
        { id: "GEL", title: "GEL" },
        { id: "GHS", title: "GHS" },
        { id: "GTQ", title: "GTQ" },
        { id: "HNL", title: "HNL" },
        { id: "HUF", title: "HUF" },
        { id: "IDR", title: "IDR" },
        { id: "ILS", title: "ILS" },
        { id: "INR", title: "INR" },
        { id: "KGS", title: "KGS" },
        { id: "KHR", title: "KHR" },
        { id: "XCD", title: "XCD" },
        { id: "KPW", title: "KPW" },
        { id: "KRW", title: "KRW" },
        { id: "LBP", title: "LBP" },
        { id: "MMK", title: "MMK" },
        { id: "MXN", title: "MXN" },
        { id: "MYR", title: "MYR" },
        { id: "NGN", title: "NGN" },
        { id: "NPR", title: "NPR" },
        { id: "NZD", title: "NZD" },
        { id: "PAB", title: "PAB" },
        { id: "PHP", title: "PHP" },
        { id: "PKR", title: "PKR" },
        { id: "PLN", title: "PLN" },
        { id: "RON", title: "RON" },
        { id: "RSD", title: "RSD" },
        { id: "RUB", title: "RUB" },
        { id: "SDG", title: "SDG" },
        { id: "SEK", title: "SEK" },
        { id: "SGD", title: "SGD" },
        { id: "EUR", title: "EUR" },
        { id: "XOF", title: "XOF" },
        { id: "SZL", title: "SZL" },
        { id: "TMT", title: "TMT" },
        { id: "TRY", title: "TRY" },
        { id: "TZS", title: "TZS" },
        { id: "UAH", title: "UAH" },
        { id: "UZS", title: "UZS" },
        { id: "VND", title: "VND" },
        { id: "VUV", title: "VUV" },
        { id: "YER", title: "YER" },
        { id: "ZAR", title: "ZAR" },
      ],

      rules: [(v) => !!v || "This field is required"],
    };
  },

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
    const regisStationOfficeCode = ref<string>("ຂັ້ນຫອ້ງການຂື້ນທະບຽນ");

    const enLegalStrature = ref<string>("ຮູບແບບວິສາຫະກິດ");
    const foreigninvestorFlag = ref<string>("ຮູບແບບການລົງທຶນ");
    const investmentAmount = ref<string>("");
    const investmentCurrency = ref<string>("ສະກຸນເງິນ");
    const representativeNationality = ref<string>("ສັນຊາດ");
    const regisCertificateNumber = ref<string>("");
    const regisDate = ref<string>("");
    const enLocation = ref<string>("");
    const villageName = ref<string>("");

    //     const selectedVillage = ref(null);
    // const selectedVillageName = ref("");
    // const villages = ref([]);
    // const title = ref("");

    const selectedVillage = ref(null);
    const selectedVillageName = ref("");
    const villages = ref([]);
    const title = ref("");

    const regisStrationOfficeType = ref<string>("");
    const EnterpriseID = ref<string>("");
    const LCICID = ref<string>("");

    const rules = [
      (value: string) => !!value || "Required.",
      (value: string) => (value && value.length >= 1) || "Min 3 characters",
    ];
    const fetchVillages = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/filter_villages/`
        );
        villages.value = response.data.map((village) => ({
          ...village,
          title: `ແຂວງ: ${village.Province_Name} - ເມືອງ: ${village.District_Name} - ບ້ານ ${village.Village_Name}`,
        }));

        console.log(
          "Fetched villages:",
          JSON.parse(JSON.stringify(villages.value))
        );
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    };

    onMounted(fetchVillages);

    const handleVillageSelect = (value: number) => {
      const selected = villages.value.find((village) => village.id === value);
      if (selected) {
        selectedVillageName.value = selected.Village_Name;
        title.value = ` ${selected.District_Name} ${selected.Province_Name}  `;
      }
      console.log("Selected village ID:", value);
      console.log("Selected village name:", selectedVillageName.value);
      console.log("Selected province and district:", title.value);
    };

    
    const submit = async () => {
      loading.value = true;
      try {
        const config = useRuntimeConfig();
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
          `${config.public.strapi.url}api/api/enterprise-info/`,
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
        })
          .then(async (result) => {
            if (result.isConfirmed) {
              await updateCollateralStatus(route.query.id);
            }
          })
          .then(() => {
            location.reload();
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

    const updateCollateralStatus = async (id: number) => {
      try {
        const config = useRuntimeConfig();
        const csrfResponse = await axios.get(
          `${config.public.strapi.url}api/api/get_csrf_token/`
        );
        const csrfToken = csrfResponse.data.csrfToken;

        await axios.post(
          `${config.public.strapi.url}api/api/confirm_image/${id}/`,
          {},
          {
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
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
        // regisStationOfficeCode.value.trim() !== "" &&
        // enLegalStrature.value.trim() !== "" &&
        // foreigninvestorFlag.value.trim() !== "" &&
        investmentAmount.value.trim() !== "" &&
        // investmentCurrency.value.trim() !== "" &&
        // representativeNationality.value.trim() !== "" &&
        EnterpriseID.value.trim() !== "" &&
        LCICID.value.trim() !== ""
      );
    });

    const fullImagePath = computed(() => {
      const config = useRuntimeConfig();
      console.log("Route Query Image:", route.query.image);
      console.log("Route Query ID:", route.query.id);
      console.log;
      return `${config.public.strapi.url}collaterals/${route.query.image}?id=${route.query.id}`;
    });

    const fetchLastLCICID = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get<{ last_lcicid: string }>(
          `${config.public.strapi.url}api/api/last-lcicid/`
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
      villageName,
      regisStrationOfficeType,
      regisStationOfficeCode,
      fetchVillages,
      villages,

      enLegalStrature,
      foreigninvestorFlag,
      investmentAmount,
      investmentCurrency,
      representativeNationality,
      fullImagePath,
      handleVillageSelect,

      isFormValid,
      rules,
      submit,
    };
  },
});
</script>

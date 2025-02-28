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
                            <v-autocomplete
                            v-model="regisStrationOfficeType"
                              :items="regisStrationOfficeTypes"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="ລະຫັດຫອ້ງການຂື້ນທະບຽນ"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
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
                              type="text"
                              label=" ທຶນຈົດທະບຽນ"
                              variant="outlined"
                               @input="formatNumber"
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
import { defineComponent, computed ,ref  } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  data() {
    return {
      regisStationOfficeCode: 1,
      enLegalStrature: 1,
      foreigninvestorFlag: 1,
      investmentCurrency: 1,
      representativeNationality: 1,
      regisStrationOfficeType:"ລະຫັດຫອ້ງການຂັ້ນທະບຽນ",

      regisStrationOfficeTypes:[
      { id:"01", title: "ນະຄອນຫຼວງວຽງຈັນ" },
      { id:"10", title: "ວຽງຈັນ" },
      { id:"11", title: "ບໍລິຄຳໄຊ" },
      { id:"12", title: "ຄຳມ່ວນ" },
      { id:"13", title: "ສະຫວັນນະເຂດ" },
      { id:"14", title: "ສາລະວັນ" },
      { id:"15", title: "ເຊກອງ" },
      { id:"16", title: "ຈຳປາສັກ" },
      { id:"17", title: "ອັດຕະປື" },
      { id:"18", title: "ໄຊສົມບູນ" },
      { id:"02", title: "ຜົ້ງສາລີ" },
      { id:"03", title: "ຫຼວງນ້ຳທາ" },
      { id:"04", title: "ອຸດົມໄຊ" },
      { id:"05", title: "ບໍ່ແກ້ວ" },
      { id:"06", title: "ຫຼວງພະບາງ" },
      { id:"07", title: "ຫົວພັນ" },
      { id:"08", title: "ໄຊຍະບູລີ" },
      { id:"09", title: "ຊຽງຂວາງ" },
      ],
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
      { "id": "AF", "title": "Afghanistan" },
    { "id": "AO", "title": "Angola" },
    { "id": "AT", "title": "Austria" },
    { "id": "AU", "title": "Australia" },
    { "id": "BD", "title": "Bangladesh" },
    { "id": "BE", "title": "Belgium" },
    { "id": "BG", "title": "Bulgaria" },
    { "id": "BO", "title": "Bolivia" },
    { "id": "BR", "title": "Brazil" },
    { "id": "CA", "title": "Canada" },
    { "id": "CL", "title": "Chile" },
    { "id": "CM", "title": "Cameroon" },
    { "id": "CN", "title": "China" },
    { "id": "CO", "title": "Colombia" },
    { "id": "CY", "title": "Cyprus" },
    { "id": "CZ", "title": "Czech Republic" },
    { "id": "DE", "title": "Germany" },
    { "id": "DK", "title": "Denmark" },
    { "id": "DM", "title": "Dominica" },
    { "id": "DO", "title": "Dominican Republic" },
    { "id": "EG", "title": "Egypt" },
    { "id": "ER", "title": "Eritrea" },
    { "id": "FI", "title": "Finland" },
    { "id": "FM", "title": "Micronesia" },
    { "id": "FR", "title": "France" },
    { "id": "GE", "title": "Georgia" },
    { "id": "GH", "title": "Ghana" },
    { "id": "GT", "title": "Guatemala" },
    { "id": "HN", "title": "Honduras" },
    { "id": "HR", "title": "Croatia" },
    { "id": "HU", "title": "Hungary" },
    { "id": "ID", "title": "Indonesia" },
    { "id": "IL", "title": "Israel" },
    { "id": "IN", "title": "India" },
    { "id": "IT", "title": "Italy" },
    { "id": "JP", "title": "Japan" },
    { "id": "KG", "title": "Kyrgyzstan" },
    { "id": "KH", "title": "Cambodia" },
    { "id": "KN", "title": "Saint Kitts and Nevis" },
    { "id": "KP", "title": "North Korea" },
    { "id": "KR", "title": "South Korea" },
    { "id": "LA", "title": "Laos" },
    { "id": "LB", "title": "Lebanon" },
    { "id": "LT", "title": "Lithuania" },
    { "id": "LU", "title": "Luxembourg" },
    { "id": "LV", "title": "Latvia" },
    { "id": "MC", "title": "Monaco" },
    { "id": "MM", "title": "Myanmar" },
    { "id": "MX", "title": "Mexico" },
    { "id": "MY", "title": "Malaysia" },
    { "id": "NG", "title": "Nigeria" },
    { "id": "NL", "title": "Netherlands" },
    { "id": "NP", "title": "Nepal" },
    { "id": "NZ", "title": "New Zealand" },
    { "id": "PA", "title": "Panama" },
    { "id": "PH", "title": "Philippines" },
    { "id": "PK", "title": "Pakistan" },
    { "id": "PL", "title": "Poland" },
    { "id": "PW", "title": "Palau" },
    { "id": "RO", "title": "Romania" },
    { "id": "RS", "title": "Serbia" },
    { "id": "RU", "title": "Russia" },
    { "id": "SD", "title": "Sudan" },
    { "id": "SE", "title": "Sweden" },
    { "id": "SG", "title": "Singapore" },
    { "id": "SI", "title": "Slovenia" },
    { "id": "SN", "title": "Senegal" },
    { "id": "SZ", "title": "Eswatini" },
    { "id": "TH", "title": "Thailand" },
    { "id": "TL", "title": "Timor-Leste" },
    { "id": "TM", "title": "Turkmenistan" },
    { "id": "TR", "title": "Turkey" },
    { "id": "TZ", "title": "Tanzania" },
    { "id": "UA", "title": "Ukraine" },
    { "id": "US", "title": "United States" },
    { "id": "UZ", "title": "Uzbekistan" },
    { "id": "VA", "title": "Vatican City" },
    { "id": "VN", "title": "Vietnam" },
    { "id": "VU", "title": "Vanuatu" },
    { "id": "YE", "title": "Yemen" },
    { "id": "ZA", "title": "South Africa" }
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


    // const formatNumber = (): void => {
    //   const number = investmentAmount.value.replace(/,/g, "");
    //   if (!isNaN(Number(number))) {
    //     investmentAmount.value = Number(number).toLocaleString();
    //   }
    // };
    const formatNumber = (): void => {
  const rawNumber = investmentAmount.value.replace(/,/g, ""); // ເອົາຈຸດຄັ່ງພັນອອກ
  if (!isNaN(Number(rawNumber))) {
    investmentAmount.value = Number(rawNumber).toLocaleString(); // ຈັດຮູບແບບສະແດງຜົນ
  }
};
   

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
      // (value: string) => (value && value.length >= 0) || "Min 3 characters",
    ];
    const fetchVillages = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/filter_villages/`
        );
        villages.value = response.data.map((village) => ({
          ...village,
          title: `ແຂວງ:${village.Province_Name}-ເມືອງ:${village.District_Name}-ບ້ານ${village.Village_Name}`,
          id: village.ID,
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
        enLocation.value = selected.Village_Name;

        title.value = ` ${selected.District_Name} ${selected.Province_Name}  `;
      }
      console.log("Selected village ID:", value);
      console.log("Selected village name:", selectedVillageName.value);
      console.log("Selected province and district:", title.value);
    };
    const submit = async () => {
  const result = await Swal.fire({
    title: "ຢືນຢັນການບັນທຶກ?",
    text: "ເຈົ້າຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ແທ້ຫຼືບໍ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
  });

  if (result.isConfirmed) {
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

      // ເອົາຈຸດຄັ່ງພັນອອກ ແລະ ປ່ຽນເປັນຕົວເລກ
      const investmentAmountFormatted = Number(investmentAmount.value.replace(/,/g, ""));

      const response = await axios.post(
        `${config.public.strapi.url}api/api/enterprise-info/`,
        {
          enterpriseNameLao: enterpriseNameLao.value,
          eneterpriseNameEnglish: eneterpriseNameEnglish.value,
          enLegalStrature: enLegalStrature.value,
          foreigninvestorFlag: foreigninvestorFlag.value,
          investmentAmount: investmentAmountFormatted, // ໃຊ້ຄ່າທີ່ປ່ຽນແລ້ວ
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
      console.log("Response:", response.data);

      Swal.fire({
        title: "ສຳເລັດ!",
        text: "ສ້າງຂໍ້ມູນວິສາຫະກິດສຳເລັດແລ້ວ!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateCollateralStatus(route.query.id);
        }
      }).then(() => {
        window.location.href = "/backend/upload/lcictest";
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
  }
};
//     const submit = async () => {
//   const result = await Swal.fire({
//     title: "ຢືນຢັນການບັນທຶກ?",
//     text: "ເຈົ້າຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ແທ້ຫຼືບໍ?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "ບັນທຶກ",
//     cancelButtonText: "ຍົກເລີກ",
//   });

//   if (result.isConfirmed) {
//     loading.value = true;
//     try {
//       const config = useRuntimeConfig();
//       const csrfToken = Cookies.get("csrftoken");

//       let regisDateFormatted = null;
//       if (regisDate.value) {
//         const dateObject = new Date(regisDate.value);
//         if (!isNaN(dateObject.getTime())) {
//           regisDateFormatted = dateObject.toISOString();
//         } else {
//           throw new Error("Invalid date format for regisDate");
//         }
//       }

//       const investmentAmountFormatted = parseFloat(investmentAmount.value);

//       const response = await axios.post(
//         `${config.public.strapi.url}api/api/enterprise-info/`,
//         {
//           enterpriseNameLao: enterpriseNameLao.value,
//           eneterpriseNameEnglish: eneterpriseNameEnglish.value,
//           enLegalStrature: enLegalStrature.value,
//           foreigninvestorFlag: foreigninvestorFlag.value,
//           investmentAmount: investmentAmountFormatted,
//           investmentCurrency: investmentCurrency.value,
//           representativeNationality: representativeNationality.value,
//           regisCertificateNumber: regisCertificateNumber.value,
//           regisDate: regisDateFormatted,
//           enLocation: enLocation.value,
//           regisStationOfficeCode: regisStationOfficeCode.value,
//           regisStrationOfficeType: regisStrationOfficeType.value,
//           EnterpriseID: EnterpriseID.value,
//           LCICID: LCICID.value,
//         },
//         {
//           headers: {
//             "X-CSRFToken": csrfToken || "",
//           },
//         }
//       );
//       console.log("Response:", response.data);

//       Swal.fire({
//         title: "ສຳເລັດ!",
//         text: "ສ້າງຂໍ້ມູນວິສາຫະກິດສຳເລັດແລ້ວ!",
//         icon: "success",
//         confirmButtonText: "OK",
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           await updateCollateralStatus(route.query.id);
//         }
//       }).then(() => {
//         window.location.href = "/backend/upload/lcictest";
        
//       });
//     } catch (error) {
//       console.error("Error creating enterprise info:", error);
//       Swal.fire({
//         title: "ຜິດພາດ!",
//         text: error.message || "ລົ້ມເຫລວໃນການສ້າງຂໍ້ມູນວິສາຫະກິດ.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       loading.value = false;
//     }
//   }
// };


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
        // enterpriseNameLao.value.trim() !== "" &&
        // eneterpriseNameEnglish.value.trim() !== "" &&
        // regisCertificateNumber.value.trim() !== "" &&
        // regisDate.value.trim() !== "" &&
        // enLocation.value.trim() !== "" &&
        // regisStrationOfficeType.value.trim() !== "" &&
        // regisStationOfficeCode.value.trim() !== "" &&
        // enLegalStrature.value.trim() !== "" &&
        // foreigninvestorFlag.value.trim() !== "" &&
        // investmentAmount.value.trim() !== "" &&
        // investmentCurrency.value.trim() !== "" &&
        // representativeNationality.value.trim() !== "" &&
        EnterpriseID.value.trim() !== "" && LCICID.value.trim() !== ""
      );
    });

    const fullImagePath = computed(() => {
      const config = useRuntimeConfig();
      console.log("Route Query Image:", route.query.image);
      console.log("Route Query ID:", route.query.id);
      console.log;
      return `${config.public.strapi.url}media/${route.query.image}?id=${route.query.id}`;
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
      formatNumber,
      isFormValid,
      rules,
      submit,
    };
  },
});
</script>

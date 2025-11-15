import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "~/helpers/axios";
import { EnterpriseModel } from "~/types";
export const useEnterprisInfo = defineStore("enterpris_member", {
  state() {
    return {
      token: localStorage.getItem("access_token"),
      form_insert_member_submit_data: {
        EnterpriseID: "",
        enterpriseNameLao: "",
        eneterpriseNameEnglish: "",
        regisCertificateNumber: "",
        regisDate: "",
        regisStrationOfficeType: "",
        regisStationOfficeCode: "",
        enLegalStrature: "",
        foreigninvestorFlag: "",
        investmentAmount: "",
        status: 1,
        investmentCurrency: "",
        representativeNationality: "",
        file: null as File | null,
        bank_id: "",
        branch_id: "",
        enLocation: null as number | any,
      },
      respons_data_list_file:
        null as EnterpriseModel.ListFileRegisterEnterpriseRespons | null,
      respon_data_check_enterprise:
        null as EnterpriseModel.CheckEnterpriseRespons | null,
      respon_data_detail_enterprise:
        null as EnterpriseModel.DetailEnterpiseWhitIDRespons | null,
      query: {
        bank_id: "",
        bank_id_filter: "",
        id: "",
        page: 1,
        limit: 20,
      },
      query_enterprise_id:{
        id_file: "",
      },
      check_enterprise: {
        EnterpriseID: "",
      },
      isLoading: false,
    };
  },
  actions: {
    async InsertEnterPrisMemberSubmit() {
      try {
        const noticonfirm = await Swal.fire({
          icon: "question",
          title: "ຢືນຢັນ",
          text: "ທ່ານຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ ຫຼື ບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (noticonfirm.isConfirmed) {
          const formData = new FormData();
          formData.append(
            "EnterpriseID",
            this.form_insert_member_submit_data.EnterpriseID
          );
          formData.append(
            "enterpriseNameLao",
            this.form_insert_member_submit_data.enterpriseNameLao
          );
          formData.append(
            "eneterpriseNameEnglish",
            this.form_insert_member_submit_data.eneterpriseNameEnglish
          );
          formData.append(
            "regisCertificateNumber",
            this.form_insert_member_submit_data.regisCertificateNumber
          );
          formData.append(
            "regisDate",
            this.form_insert_member_submit_data.regisDate
          );
          formData.append(
            "regisStrationOfficeType",
            this.form_insert_member_submit_data.regisStrationOfficeType
          );
          formData.append(
            "regisStationOfficeCode",
            this.form_insert_member_submit_data.regisStationOfficeCode
          );
          formData.append(
            "enLegalStrature",
            this.form_insert_member_submit_data.enLegalStrature
          );
          formData.append(
            "foreigninvestorFlag",
            this.form_insert_member_submit_data.foreigninvestorFlag
          );
          formData.append(
            "investmentAmount",
            this.form_insert_member_submit_data.investmentAmount
          );
          formData.append(
            "status",
            this.form_insert_member_submit_data.status.toString()
          );
          formData.append(
            "investmentCurrency",
            this.form_insert_member_submit_data.investmentCurrency
          );
          formData.append(
            "representativeNationality",
            this.form_insert_member_submit_data.representativeNationality
          );
          formData.append(
            "bank_id",
            this.form_insert_member_submit_data.bank_id
          );
          formData.append(
            "branch_id",
            this.form_insert_member_submit_data.branch_id
          );
          formData.append(
            "enLocation",
            this.form_insert_member_submit_data.enLocation as unknown as string
          );
          formData.append(
            "file",
            this.form_insert_member_submit_data.file as Blob
          );
          const req = await axios.post("/api/enterprises/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.token}`,
            },
          });
          if (req.status === 201) {
            Swal.fire({
              icon: "success",
              title: "ສຳເລັດ",
              text: "ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              goPath("#");
            }, 1500);
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
          showConfirmButton: true,
          confirmButtonText: "ຕົກລົງ",
        });
      }
    },
    async GetdataListFileEnterpris() {
      this.isLoading = true;
      try {
        const res =
          await axios.get<EnterpriseModel.ListFileRegisterEnterpriseRespons>(
            "/api/api/collateral/",
            {
              params: {
                ...this.query,
              },
            }
          );
        if (res.status === 200) {
          this.respons_data_list_file = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດໄດ້ຮັບຂໍ້ມູນໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async GetdataDetailEnterprisID() {
      this.isLoading = true;
      try {
        const res =
          await axios.get<EnterpriseModel.DetailEnterpiseWhitIDRespons>(
            "/api/enterprises/?",
            {
              params: {
                ...this.query_enterprise_id,
              },
              headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.token}`,
            },
            }
          );
        if (res.status === 200) {
          this.respon_data_detail_enterprise = res.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດໄດ້ຮັບຂໍ້ມູນໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async CheckEnterpriseID() {
      this.isLoading = true;
      try {
        const notification = await Swal.fire({
          icon: "question",
          title: "ຢືນຢັນ",
          text: "ທ່ານຕ້ອງການກວດສອບ ລະຫັດ ວິສາຫະກິດ ຫຼື ບໍ່?",
          showCancelButton: true,
          confirmButtonText: "ຕົກລົງ",
          cancelButtonText: "ຍົກເລີກ",
        });
        if (notification.isConfirmed) {
          const formData = new FormData();
          formData.append("EnterpriseID", this.check_enterprise.EnterpriseID);
          const req = await axios.post<EnterpriseModel.CheckEnterpriseRespons>(
            `/api/check-enterprise/`,
            formData
          );
          if (req.status === 200) {
            this.respon_data_check_enterprise = req.data;
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດກວດສອບ ລະຫັດ ວິສາຫະກິດໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
});

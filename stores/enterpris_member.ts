import { defineStore } from "pinia";
import Swal from "sweetalert2";
import axios from "~/helpers/axios";
import { EnterpriseModel } from "~/types";
export const useEnterprisInfo = defineStore("enterpris_member", {
  state() {
    return {
      token: localStorage.getItem("access_token"),
      form_company_info_customer_mact_lcic: {
        segment: "",
        bnk_code: "",
        branchcode: "",
        customerid: "",
        com_enterprise_code: "",
        enterprise_code: "",
        com_registration_date: "",
        com_registration_place_issue: "",
        com_name: "",
        com_lao_name: "",
        com_tax_no: "",
        com_category: "",
        com_regulatory_capital: "",
        com_regulatory_capital_unit: "",
        com_insert_date: "",
        com_update_date: "",
        mm_action_date: "",
        mm_log: "",
        mm_comment: "",
        mm_by: "",
        blk_sys_id: "",
        mm_status: "1",
        is_manual: "",
        com_lao_name_code: "",
        LCIC_code: "",
        status: "1",
      },
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
      form_inset_data: {
        register_id: "",
      },

      respons_data_list_customer:
        null as EnterpriseModel.ListRegisterCustomerRespons | null,
      respons_data_detail_companymapping:
        null as EnterpriseModel.DataDetail | null,
      respons_data_list_file:
        null as EnterpriseModel.ListFileRegisterEnterpriseRespons | null,
      respon_data_check_enterprise:
        null as EnterpriseModel.CheckEnterpriseRespons | null,
      respon_data_detail_enterprise:
        null as EnterpriseModel.DetailEnterpiseWhitIDRespons | null,
      list_data_enterprise: null as EnterpriseModel.ListEnterprisRespons | null,
      query: {
        bank_id: "",
        bank_id_filter: "",
        id: "",
        page: 1,
        limit: 20,
      },
      query_enterprise_id: {
        id_file: "",
      },
      check_enterprise: {
        EnterpriseID: "",
      },
      form_aprove: {
        collateral_id: "",
        approved_by: "",
      },
      form_reject: {
        collateral_id: "",
        rejected_by: "",
        reason: "",
      },
      filter_enterprise: {
        query: {
          limit: 20,
          page: 1,
          enLegalStrature: "",
          EnterpriseID: "",
        },
        isLoading: false,
      },
      filter_customer_register: {
        query: {
          page_size: 20,
          page: 1,
          bnk_code: "",
          bnk_code_filter: "",
        },
      },
      isLoading: false,
    };
  },
  actions: {
    async InsertEnterPrisMemberSubmit() {
      try {
        if (!this.form_insert_member_submit_data.file) {
          Swal.fire({
            icon: "warning",
            title: "ຄຳເຕືອນ",
            text: "ກະລຸນາແນບເອກະສານອ້າງອີງ",
            showConfirmButton: false,
            timer: 2000,
          });
          return { success: false, message: "ບໍ່ມີໄຟລ໌" };
        }

        if (!this.form_insert_member_submit_data.EnterpriseID) {
          Swal.fire({
            icon: "warning",
            title: "ຄຳເຕືອນ",
            text: "ກະລຸນາປ້ອນລະຫັດວິສາຫະກິດ",
            showConfirmButton: false,
            timer: 2000,
          });
          return { success: false, message: "ບໍ່ມີລະຫັດວິສາຫະກິດ" };
        }

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
              goPath("/backend/register_lcic/list_file");
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
    async GetdataListRegisCustomer() {
      this.isLoading = true;
      try {
        const res =
          await axios.get<EnterpriseModel.ListRegisterCustomerRespons>(
            "api/api/register/list/",
            {
              params: {
                ...this.filter_customer_register.query,
              },
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${this.token}`,
              },
            }
          );
        if (res.status === 200) {
          this.respons_data_list_customer = res.data;
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
    async SeachEnterpris() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("EnterpriseID", this.check_enterprise.EnterpriseID);
        const req = await axios.post<EnterpriseModel.CheckEnterpriseRespons>(
          `/api/check-enterprise/`,
          formData
        );
        if (req.status === 200) {
          this.respon_data_check_enterprise = req.data;
        }
      } catch (error) {
        console.log("ບໍມີຂໍ້ມູນ Enterpise ນີ້");
      } finally {
        this.isLoading = false;
      }
    },

    async Approve() {
      this.isLoading = true;
      try {
        const notification = await Swal.fire({
          icon: "question",
          title: "ຢືນຢັນ",
          text: "ທ່ານຕອ້ງການທີ່ຈະຢືນຢັນແທ້ຫຼືບໍ  ?",
          showCancelButton: true,
          cancelButtonText: "ຍົກເລີກ",
          confirmButtonText: "ຢືນຢັນ",
        });
        if (notification.isConfirmed) {
          const dataForm = new FormData();
          dataForm.append("collateral_id", this.form_aprove.collateral_id);
          dataForm.append("approved_by", this.form_aprove.approved_by);
          const req = await axios.post(`api/api/collateral/approve/`, dataForm);
          if (req.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ສຳເລັດ",
              text: "ຢືນຢັນສຳເລັດ",
              timer: 2000,
              showConfirmButton: false,
            });
            setTimeout(() => {
              goPath(`/backend/register_lcic/list_file`);
            }, 2000);
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດ ຢືນຢັນໄດ້ເດໍກີດຂໍ້ຜິດພາດ",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        this.isLoading = false;
      }
    },
    async Reject() {
      this.isLoading = true;
      try {
        if (!this.form_reject.reason || this.form_reject.reason.trim() === "") {
          Swal.fire({
            icon: "warning",
            title: "ແຈ້ງເຕືອນ",
            text: "ກະລຸນາປ້ອນເຫດຜົນການປະຕິເສດກ່ອນ",
            timer: 2000,
            showConfirmButton: false,
          });
          return false;
        }

        if (!this.form_reject.collateral_id) {
          Swal.fire({
            icon: "warning",
            title: "ແຈ້ງເຕືອນ",
            text: "ບໍ່ພົບ ID ຂອງເອກະສານ",
            timer: 2000,
            showConfirmButton: false,
          });
          return false;
        }

        const notification = await Swal.fire({
          icon: "question",
          title: "ຢືນຢັນການປະຕິເສດ",
          text: "ທ່ານຕ້ອງການທີ່ຈະປະຕິເສດແທ້ຫຼືບໍ່?",
          showCancelButton: true,
          cancelButtonText: "ຍົກເລີກ",
          confirmButtonText: "ຢືນຢັນ",
          confirmButtonColor: "#d33",
          cancelButtonColor: "#757575",
        });

        if (notification.isConfirmed) {
          const dataForm = new FormData();
          dataForm.append("collateral_id", this.form_reject.collateral_id);
          dataForm.append("rejected_by", this.form_reject.rejected_by);
          dataForm.append("reason", this.form_reject.reason);

          const req = await axios.post(`api/api/collateral/reject/`, dataForm);

          if (req.status === 200 && req.data.success) {
            await Swal.fire({
              icon: "success",
              title: "ສຳເລັດ",
              text: "ປະຕິເສດສຳເລັດແລ້ວ",
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true,
            });

            setTimeout(() => {
              goPath(`/backend/register_lcic/list_file`);
            }, 2000);

            return true;
          } else {
            throw new Error(req.data.message || "ບໍ່ສາມາດປະຕິເສດໄດ້");
          }
        }

        return false;
      } catch (error: any) {
        console.error("Reject Error:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "ບໍ່ສາມາດປະຕິເສດໄດ້ ເກີດຂໍ້ຜິດພາດ";

        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: errorMessage,
          timer: 3000,
          showConfirmButton: false,
        });

        return false;
      } finally {
        this.isLoading = false;
      }
    },

    resetForms() {
      this.form_reject = {
        collateral_id: "",
        rejected_by: "",
        reason: "",
      };
    },

    async GetEnterpriseList() {
      this.isLoading = true;
      try {
        const res = await axios.get<EnterpriseModel.ListEnterprisRespons>(
          `/api/api/enterprises_list/`,
          {
            params: {
              ...this.filter_enterprise.query,
            },
          }
        );
        if (res.status === 200) {
          this.list_data_enterprise = res.data;
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
    async CreateMactCustomer() {
      this.isLoading = true;
      try {
        const notification = await Swal.fire({
          icon: "question",
          title: "ຢືນຢັນ",
          text: "ທ່ານຕ້ອງການທີ່ຈະບັນທຶກຂໍ້ມູນແທ້ຫຼືບໍ່?",
          showCancelButton: true,
          cancelButtonText: "ຍົກເລີກ",
          confirmButtonText: "ຢືນຢັນ",
        });

        if (notification.isConfirmed) {
          const payload = {
            segment: this.form_company_info_customer_mact_lcic.segment,
            bnk_code: this.form_company_info_customer_mact_lcic.bnk_code,
            branchcode: this.form_company_info_customer_mact_lcic.branchcode,
            customerid: this.form_company_info_customer_mact_lcic.customerid,
            enterprise_code:
              this.form_company_info_customer_mact_lcic.enterprise_code,
            com_enterprise_code:
              this.form_company_info_customer_mact_lcic.enterprise_code,
            LCIC_code: this.form_company_info_customer_mact_lcic.LCIC_code,
            com_name: this.form_company_info_customer_mact_lcic.com_name,
            com_lao_name:
              this.form_company_info_customer_mact_lcic.com_lao_name,
            com_tax_no: this.form_company_info_customer_mact_lcic.com_tax_no,
            com_registration_date:
              this.form_company_info_customer_mact_lcic.com_registration_date,
            com_registration_place_issue:
              this.form_company_info_customer_mact_lcic
                .com_registration_place_issue,
            com_category:
              this.form_company_info_customer_mact_lcic.com_category,
            com_regulatory_capital:
              this.form_company_info_customer_mact_lcic.com_regulatory_capital?.replace(
                /,/g,
                ""
              ),
            com_regulatory_capital_unit:
              this.form_company_info_customer_mact_lcic
                .com_regulatory_capital_unit,
            mm_status: this.form_company_info_customer_mact_lcic.mm_status,
            status: this.form_company_info_customer_mact_lcic.status,
            mm_comment: this.form_company_info_customer_mact_lcic.mm_comment,
            mm_by: this.form_company_info_customer_mact_lcic.mm_by,
            com_lao_name_code:
              this.form_company_info_customer_mact_lcic.com_lao_name_code,
          };

          const req = await axios.post(`/api/api/company/create/`, payload);

          if (req.data.success) {
            await Swal.fire({
              icon: "success",
              title: "ສຳເລັດ",
              text: req.data.message || "ບັນທຶກຂໍ້ມູນສຳເລັດ",
              timer: 2000,
              showConfirmButton: false,
            });
            return req.data;
          }
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "ບໍ່ສາມາດບັນທຶກໄດ້ ເກີດຂໍ້ຜິດພາດ";
        await Swal.fire({
          icon: "warning",
          title: "ຜິດພາດ",
          text: errorMessage,
          confirmButtonText: "ຕົກລົງ",
        });
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async GetDetailDataCompanyMaping(id: string) {
      this.isLoading = true;
      try {
        const res =
          await axios.get<EnterpriseModel.ListRegisterCustomerDetailRespons>(
            `api/api/company/info/${id}`
          );
        if (res.status === 200) {
          this.respons_data_detail_companymapping = res.data.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ຜິດພາດ",
          text: "ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້",
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        this.isLoading = false;
      }
    },
    async CreatInser(){
      this.isLoading = true
      try {
        const notificaton = await Swal.fire({
          icon:"warning",
          title:"ຢືນຢັນ",
          text:"ທ່ານຕອ້ງການຢື້ນນີ້ແທ້ບໍ",
          showConfirmButton:true,
          showCancelButton:true,
          confirmButtonText:"ຕົກລົງ",
          cancelButtonText:"ຍົກເລີກ"

        });if(notificaton.isConfirmed){
          const dataForm = new FormData()
          dataForm .append("register_id", this.form_inset_data.register_id)
          const req = await axios.post(`/api/api/approve-enterprise-mapping/`,dataForm);
          if(req.status === 200){
            Swal.fire({
              icon:"success",
          title:"ສຳເລັດ",
          text:"ຢັງຢືນສຳເລັດ",
          showConfirmButton:true,
          showCancelButton:true,
            })
          }
        }
      } catch (error) {
        console.log("error")
      }finally{
        this.isLoading= false
      }
    }
  },
});

import { defineStore } from "pinia";
import axios from "~/helpers/axios";
export const useEnterprisInfo = defineStore("enterpris_member",{
    state(){
        return {
            form_insert_member_submit_data:{
                EnterpriseID:"",
                enterpriseNameLao:"",
                eneterpriseNameEnglish:"",
                regisCertificateNumber:"",
                regisDate:"",
                regisStrationOfficeType:"",
                regisStationOfficeCode:"",
                enLegalStrature:"",
                foreigninvestorFlag:"",
                investmentAmount:"",
                status: 1,
                investmentCurrency:"",
                representativeNationality:"",
                

            }
        }
    }
})
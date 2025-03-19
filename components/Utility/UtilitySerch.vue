<template>
  <div class="d-flex justify-center align-center" style="height: 80vh">
    <v-form width="80vh" style="width: 70vh">
      <div style="border: 2px #0d47a1 solid; width: 70vh" class="rounded-lg">
        <v-container>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-row>
                  <p>
                    <v-checkbox-btn label="ໄຟຟ້າ" v-model="eletronic">
                    </v-checkbox-btn>
                  </p>
                  <p>
                    <v-checkbox-btn label="ນໍ້າປະປາ" v-model="water">
                    </v-checkbox-btn>
                  </p>
                  <p>
                    <v-checkbox-btn label="ໂທລະຄົມ" v-model="tolecom">
                    </v-checkbox-btn>
                  </p>
                </v-row>
              </v-col>
              <LineLin title="title" />
              <v-col cols="12">
                <v-text-field
                  v-if="eletronic"
                  :disabled="!eletronic"
                  label="ປອ້ນລະຫັດເລກກົ້ງເຕີໄຟຟ້າ"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-if="water"
                  :disabled="!water"
                  label="ປອ້ນລະຫັດເລກກົງເຕີ້ນໍ້າ"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-if="tolecom"
                  :disabled="!tolecom"
                  label="ປອ້ນເບີ້ໂທລະສັບ"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col>
                <v-btn color="primary" block>ຄົ້ນຫາ</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-container></div
    ></v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const title = "ລາຍການຄົ້ນຫາ"
const eletronic = ref(false);
const water = ref(false);
const tolecom = ref(false);
</script>

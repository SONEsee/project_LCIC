<script setup lang="ts">

  import useStrapiApi from "@/composables/useStrapiApi"

  definePageMeta({
    layout: "backend",
  })

  useHead({
    title: 'Product',
    meta: [
      { 
        name: 'keywords', 
        content: 'Product, Nuxt 3, Backend'
      },
      {
        name: 'Description',
        content: 'Product Nuxt 3,  IT Genius Engineering'
      }
    ]
  })

  // Dialog ========================================================
  const dialog = ref(false);
  const search = ref("");
  const editedIndex = ref(-1)

  function close() {
    dialog.value = false;
    setTimeout(() => {
    }, 300)
  }

  //Computed Property
  const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Add New Product" : "Edit Product"
  })

  // ================================================================

  // Pagination =====================================================
  const initPage = ref(1)

  // Call Product API useStrapiApi
  const { data: products } = await useStrapiApi().getProducts(initPage.value, 25)
  // console.log(products.value?.data)

  // สร้างตัวแปรเพื่อเก็บค่า page ที่เลือก
  const page:any = ref(products.value?.meta.pagination.page)

  // สร้างตัวแปรเพื่อเก็บค่าจำนวนหน้าทั้งหมด
  const pageCount:any = ref(products.value?.meta.pagination.pageCount)

  // console.log(page.value)
  // console.log(pageCount.value)

  // สร้างฟังก์ชันเพื่อเปลี่ยนหน้า
  const handlePageChange = async (page:any) => {
    // console.log(page)
    initPage.value = page
    // console.log(initPage.value)
    // สั่งให้เรียกข้อมูลใหม่
    const { data: newproducts } = await useStrapiApi().getProducts(initPage.value, 25)
    products.value = newproducts.value
  }
  // ================================================================

</script>

<template>
  <v-row>
    <v-col cols="12" sm="12">
      <v-card>
        <v-card-text class="pa-5">
          
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <v-text-field
                density="compact"
                v-model="search"
                label="Search Products"
                hide-details
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">

              <!-- Add Product Diaglog -->
              <v-dialog v-model="dialog">
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" v-bind="props" class="ml-auto">
                    <MIcon name="ph:plus" /> Add Product
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form ref="form">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              label="Id"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              label="User info"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              label="User email"
                              type="email"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              label="Phone"
                              type="phone"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              label="Joining Date"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              label="Role"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>

                  <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="close">Cancel</v-btn>
                    <v-btn
                      color="secondary"
                      variant="elevated"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-col>
          </v-row>

          <!-- Add Pagination -->
          <v-pagination 
            v-model="page" 
            :length="pageCount"
            @next="handlePageChange"
            @prev="handlePageChange"
            @update:modelValue="handlePageChange">
          </v-pagination>

          <v-table class="mt-5">

            <thead>
              <tr>
                <th>Id</th>
                <th>ProductInfo</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="product in products?.data" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <div class="d-flex align-center py-4">

                    <div v-if="product.attributes.image.data">
                      <v-img
                        :src="`http://localhost:1337${product.attributes.image.data[0].attributes.formats.thumbnail.url}`"
                        class="rounded-circle img-fluid"
                        width="100px"
                      ></v-img>
                    </div>
                    <div v-else>
                      <v-img
                        src="/images/products/4.jpg"
                        width="100px"
                        class="rounded-circle img-fluid"
                      ></v-img>
                    </div>

                    <div class="ml-5">
                      <h2>{{ product.attributes.title }}</h2>
                      <span class="subtitle-2 d-block font-weight-regular">{{
                        product.attributes.description.slice(0, 150)
                      }}...</span>
                    </div>
                  </div>
                </td>
                <td>{{ product.attributes.price }}</td>
                <td>{{ product.attributes.qty }}</td>
                <td>{{ product.attributes.category.data.attributes.title }}</td>
                <td>
                  <v-icon
                    small
                    class="mr-2 text-info cursor-pointer"
                    title="Edit"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    small
                    class="text-error cursor-pointer"
                    title="Delete"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </tbody>
            
          </v-table>

        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
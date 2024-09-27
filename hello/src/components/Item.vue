<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      item-key="code"
      class="elevation-1"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus',
      }"
    ></v-data-table>
  </div>
</template>


<script>
import store from "../store";
export default {
  data() {
    return {
      headers: [
        { text: "code", value: "prefecture_code" },
        { text: "Prefecturename", value: "prefecture_name" },
      ],
    };
  },
  created: function () {
    store.dispatch("product/initproduct");
  },
  computed: {
    items() {
      return store.getters["product/getproducts"];
    },
  },
};
</script>
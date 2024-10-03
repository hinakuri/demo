<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      item-key="ID"
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
        { text: "社員番号", value: "employee_number" },
        { text: "時給", value: "unit_price" },
        { text: "開始日", value: "start_date" },
        { text: "終了日", value: "end_date" },
      ],
    };
  },
  created: function () {
    store.dispatch("price/initprice");
  },
  computed: {
    items() {
      return store.getters["price/getprices"];
    },
  },
};
</script>
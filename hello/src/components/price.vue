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
        { text: "ID", value: "id" },
        { text: "社員番号", value: "employee_number" },
        { text: "時給", value: "unit_price" },
        { text: "開始日", value: "start_date" },
        { text: "終了日", value: "end_date" },
        { text: "作成日", value: "create_day"  },
        { text: "作成時間", value: "create_time" },
        { text: "更新日", value: "update_day"  },
        { text: "更新時間", value: "update_time" },
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
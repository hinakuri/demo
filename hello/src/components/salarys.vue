<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      item-key="id"
      :filter="filter"
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
        { text: "月", value: "month_day"},
        {text: "名前",value: "employee_name"},
        { text: "時給",value: "unit_price"},
        { text: "時間",value: "work_time"},
        { text: "金額",value: "amount_money"},
        { text: "稼働日数",value: "working_days"},
        { text: "休暇",value: "holiday"},
        { text: "作成日",value: "create_day"},
        { text: "作成時間",value: "create_time"},
        { text: "更新日",value: "update_day"},
        { text: "更新時間",value: "update_time"},
      ],
    };
  },
  created: function () {
    store.dispatch("salarys/initsalary");
  },
  computed: {
    items() {
      return store.getters["salarys/getsalarys"];
    },
  },
};
</script>

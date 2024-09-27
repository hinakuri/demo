<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
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
        { text: "社員番号", value: "employee_number" },
        {
          text: "姓",
          align: "start",
          value: "employee_first_name",
        },
        { text: "名", value: "employee_last_name" },
        { text: "入社日", value: "employment_start_date" },
        { text: "都道府県", value: "prefecture_name" },
        { text: "作成日", value: "create_day"  },
       { text: "作成時間", value: "create_time" },
       { text: "更新日", value: "update"  },
       { text: "更新時間", value: "update_time" },
      ],
    };
  },
  created: function () {
    store.dispatch("user/inituser");
  },
  computed: {
    items() {
      return store.getters["user/getusers"];
    },
  },
};
</script>

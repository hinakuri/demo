<template>
  <v-data-table
    :headers="headers"
    :items="body"
    sort-by="id"
    class="elevation-1">
    <template v-slot:top>
      <div>
        <v-toolbar flat>
          <v-toolbar-title>salarys</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Data
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.month"
                        label="年"
                        :rules="[rules.required, rules.max_month]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-container>
                        <v-select :items="['01','02','03','04','05','06',
                        '07','08','09','10','11','12']"
                        label="月"
                        v-model="editedItem.day"
                        dense
                        ></v-select>
                      </v-container>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.employee_number"
                        label="社員番号"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.unit_price"
                        label="時給"
                        :rules="[rules.required, rules.min_salarys]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.work_time"
                        label="時間"
                        :rules="[rules.required, rules.max_time]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.amount_money"
                        label="金額"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.working_days"
                        label="稼働日数"
                        :rules="[rules.required, rules.max_day]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.holiday"
                        label="休暇"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <template v-slot:extension>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="editedItem.month"
                  label="年"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-select :items="['01','02','03','04','05','06',
                  '07','08','09','10','11','12']"
                  label="月"
                  density="comfortable"
                  v-model="editedItem.day"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-select 
                  label="社員番号"
                  v-model="editedItem.employee_number"
                  item-text="employee_number"
                  :items="items"
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
           <v-spacer></v-spacer>
             <template >
               <v-btn width="110" color="primary" @click="serch"
                  >serch</v-btn>
              </template>
            </template>
        </v-toolbar>
      </div>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import store from "../store";
import axios from 'axios'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
     select: null,
    headers: [
        { text: "年月", value: "month_day" },
        {text: "名前",value: "employee_name"},
        { text: "時給", value: "unit_price" },
        { text: "時間", value: "work_time" },
        { text: "金額", value: "amount_money" },
        { text: "稼働日数", value: "working_days" },
        { text: "休暇", value: "holiday" },
        { text: "作成日", value: "create_day"  },
        { text: "作成時間", value: "create_time" },
        { text: "更新日", value: "update_day"  },
        { text: "更新時間", value: "update_time" },
        { text: "Actions", value: "actions", sortable: false },
    ],
    items: 
      [],
    rules: {
       required : value => !!value || '文字を入力してください',
       max_month : value => value <= 2024 || '不正です',
       min_salarys : value => value >= 1054 || '最低賃金を下回っています',
       max_time : value => value <= 250 || '働きすぎです',
       max_day : value => value <= 31 || '不正です'

    },
    editedIndex: -1,
    deleteId: -1,
    editedItem: {
      employee_number: "",
      month_day: "",
      employee_name: "",
      work_time: "",
      amount_money: "",
      working_days: "",
      holiday: "", 
      month: "", 
      day: "", 
    },
    defaultItem: {
      month_day: "",
      employee_number: "",
      employee_name: "",
      work_time: "",
      amount_money: "",
      working_days: "",
      holiday: "", 
      month: "",
      day: "",
    },
  }),
  mounted() {
    axios
      .get("http://localhost:80/account/get")
      .then((response) => (this.items = response.data))
      .catch((error) => console.log(error));
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Data" : "Edit Item";
    },
    body() {
      return store.getters["salarys/getsalarys"];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created: function () {
    store.dispatch("salarys/initsalary");
  },

  methods: {
    initialize() {
      store.dispatch("salarys/initsalary");
    },

    editItem(item) {
      this.editedIndex = this.body.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.body.indexOf(item);
      this.deleteId = item.employee_number;
      this.dialogDelete = true;
    },
    serchItem(item) {
      this.editedIndex = this.body.indexOf(item);
      this.serchId = item.month;
      this.dialog = true;
    },

    deleteItemConfirm() {
      store.dispatch("salarys/deletesalary", {
        id: this.deleteId,
        index: this.editedIndex,
      });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      store.dispatch("salarys/postsalary", {
        index: this.editedIndex,
        salary: this.editedItem,
      });
      Object.assign(this.body[this.editedIndex], this.editedItem);
      this.close();
    },
     serch() {
      store.dispatch("salarys/serchsalary", {
        month: this.editedItem.month,
        day: this.editedItem.day,
        employee_number: this.editedItem.employee_number,
      });
      Object.assign(this.editedItem.month,this.editedItem.day);
      this.close();
    },
  },
};
</script>
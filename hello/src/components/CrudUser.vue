<template>
  <v-data-table
    :headers="headers"
    :items="body"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>CRUD User</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Item
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
                      v-model="editedItem.employee_number"
                      label="Id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.employee_first_name"
                      label="employee_first_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.employee_last_name"
                      label="employee_last_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.employment_start_date"
                      label="employment_start_date"
                    ></v-text-field>
                  </v-col>
                   <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.prefecture_code"
                      label="prefecture_code"
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
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "社員番号", value: "employee_number" },
      {
        text: "姓",
        value: "employee_first_name",
      },
      { text: "名", value: "employee_last_name" },
      { text: "入社日", value: "employment_start_date" },
      { text: "都道府県名", value: "prefecture_name"  },
      { text: "作成日", value: "create_day"  },
      { text: "作成時間", value: "create_time" },
      { text: "更新日", value: "update"  },
      { text: "更新時間", value: "update_time" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    deleteId: -1,
    editedItem: {
      employee_number: "",
      employee_first_name: "",
      employee_last_name: "",
      employment_start_date: "",
      prefecture_code: "",
      create_day: "",
      create_time: "",
      update: "",
      update_time: "",
    
    },
    defaultItem: {
       employee_number: "",
      employee_first_name: "",
      employee_last_name: "",
      employment_start_date: "",
      prefecture_code: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    body() {
      return store.getters["user/getusers"];
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
    store.dispatch("user/inituser");
  },

  methods: {
    initialize() {
      store.dispatch("user/inituser");
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

    deleteItemConfirm() {
      store.dispatch("user/deleteUser", {
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
      store.dispatch("user/postuser", {
        index: this.editedIndex,
        user: this.editedItem,
      });
      Object.assign(this.body[this.editedIndex], this.editedItem);
      this.close();
    },
  },
};
</script>
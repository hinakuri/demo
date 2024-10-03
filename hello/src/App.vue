<template>
  <v-app>
    <v-app-bar app clipped-left>
      <v-toolbar-title>
        <router-link to="/item" tag="button">マスターメンテ</router-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app clipped>
      <v-expansion-panels multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>都道府県</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <!-- <v-list-item>
                <v-btn text>在庫管理</v-btn>
              </v-list-item> -->
              <!-- <v-list-item>
                <v-btn text></v-btn>
              </v-list-item> -->
              <v-list-item>
                <router-link to="/item" tag="button">都道府県一覧</router-link>
              </v-list-item>
              <v-list-item>
                <router-link to="/cruditem" tag="button">都道府県編集</router-link>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
         <v-expansion-panel>
          <v-expansion-panel-header>給与</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <!-- <v-list-item>
                <v-btn text>給与管理管理</v-btn>
              </v-list-item> -->
              <!-- <v-list-item>
                <v-btn text></v-btn>
              </v-list-item> -->
              <v-list-item>
                <router-link to="/salarys" tag="button">給与一覧</router-link>
              </v-list-item>
              <v-list-item>
                <router-link to="/crudsalarys" tag="button">給与登録</router-link>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>アカウント管理</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item>
                <!-- <v-btn text>アカウント追加</v-btn> -->
                <router-link to="/user" tag="button">アカウントビュー</router-link
                >
                <!-- <router-link to="/User">アカウント</router-link> -->
              </v-list-item>
              <v-list-item>
                <!-- <v-btn text>アカウント追加</v-btn> -->
                <router-link to="/cruduser" tag="button">アカウント編集</router-link>
                <!-- <router-link to="/User">アカウント</router-link> -->
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>契約単価</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item>
                <!-- <v-btn text>契約単価一覧</v-btn> -->
                <router-link to="/price" tag="button">契約単価一覧</router-link>
                <!-- <router-link to="/User">単価</router-link> -->
              </v-list-item>
              <v-list-item>
                <!-- <v-btn text>契約単価追加</v-btn> -->
                <router-link to="/CrudPrice" tag="button">単価編集</router-link>
                <!-- <router-link to="/User">契約</router-link> -->
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-main>
      <!-- <router-link to="/" class="link">Home</router-link> -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {};
</script>
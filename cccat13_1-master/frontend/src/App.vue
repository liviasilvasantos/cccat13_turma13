<script setup lang="ts">
  import axios from "axios";
  import {ref} from "vue";

  const input = ref({
    name: "",
    email:"",
    cpf: "",
    isPassenger:false,
    isDriver:false
  });

  const accountId = ref("");
  async function signup(){
    const response = await axios.post("http://localhost:3000/signup", input.value);
    const output = response.data;
    accountId.value = output.accountId;
  }
</script>

<template>
  <div>
    <h2 class="signup-title">Signup</h2>
    <input class="signup-name" type="text" v-model="input.name"/>
    <input class="signup-email" type="text" v-model="input.email"/>
    <input class="signup-cpf" type="text" v-model="input.cpf"/>
    <input class="signup-is-passenger" type="checkbox" v-model="input.isPassenger"/>
    <button class="signup-submit" @click="signup()">Submit</button>
    <span class="signup-account-id">{{ accountId }}</span>
  </div>
</template>

<style scoped>
</style>

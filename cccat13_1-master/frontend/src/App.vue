<script setup lang="ts">
  import {ref} from "vue";
  import RideGatewayHttp from './infra/gateway/RideGatewayHttp';

  const input = ref({
    name: "",
    email:"",
    cpf: "",
    isPassenger:false,
    isDriver:false
  });

  const accountId = ref("");
  const error = ref("");
  async function signup(){
    try {
      const rideGateway = new RideGatewayHttp();
      const output = await rideGateway.signup(input.value);
      accountId.value = output.accountId;
    }catch(e:any){
      error.value = e.response.data.message;
    }
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
    <span v-if="accountId" class="signup-account-id">{{ accountId }}</span>
    <span class="signup-error">{{ error }}</span>
  </div>
</template>

<style scoped>
</style>

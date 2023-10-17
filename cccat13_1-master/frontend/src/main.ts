import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import RideGatewayHttp from './infra/gateway/RideGatewayHttp';
import AxiosAdapter from './infra/gateway/http/AxiosAdapter';


const app = createApp(App);
const httpClient = new AxiosAdapter();
app.provide("rideGateway", new RideGatewayHttp(httpClient));
app.mount('#app')

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import RideGatewayHttp from './infra/gateway/RideGatewayHttp';
// import AxiosAdapter from './infra/gateway/http/AxiosAdapter';
import FetchAdapter from './infra/gateway/http/FetchAdapter';


const app = createApp(App);
// const httpClient = new AxiosAdapter();
const httpClient = new FetchAdapter();
app.provide("rideGateway", new RideGatewayHttp(httpClient));
app.mount('#app')

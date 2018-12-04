<template>
  <div id="app">
    <el-container>
      <el-main>
        <price-form @predictedPrice="predictedPrice = $event" />
        <predicted-price-card :price="predictedPrice" />
      </el-main>
      <el-footer>
        <p>2018 - Guillermo Peralta</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Container, Main, Footer} from 'element-ui';

import PriceForm from './components/PriceForm.vue';
import PredictedPriceCard from './components/PredictedPriceCard.vue';

export default Vue.extend({
  name: 'app',
  components: {
    [Container.name]: Container,
    [Main.name]: Main,
    [Footer.name]: Footer,
    PriceForm,
    PredictedPriceCard,
  },
  data() {
    return {
      predictedPrice: 0,
    };
  },
});
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

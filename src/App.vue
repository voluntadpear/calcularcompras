<template>
  <div id="app">
    <el-container>
      <el-main>
        <price-form @predictedPrice="predictedPrice = $event" />
        <transition name="el-fade-in">
          <predicted-price-card :price="predictedPrice" v-if="predictedPrice" />
        </transition>
      </el-main>
      <el-footer> <p>2018 - Guillermo Peralta</p> </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Container, Main, Footer } from "element-ui";

import PriceForm from "./components/PriceForm.vue";
import PredictedPriceCard from "./components/PredictedPriceCard.vue";

export default Vue.extend({
  name: "app",
  components: {
    [Container.name]: Container,
    [Main.name]: Main,
    [Footer.name]: Footer,
    PriceForm,
    PredictedPriceCard
  },
  data() {
    return {
      predictedPrice: 0
    };
  }
});
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 800px;
  margin: 25px auto;
}

.el-form-item__label {
  font-size: 30px;
}

.el-input--large {
  font-size: 24px;
}
</style>

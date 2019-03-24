<template>
  <div id="app">
    <el-container>
      <el-main>
        <price-form @predictedPrice="predictedPrice = $event" />
        <transition name="el-fade-in">
          <predicted-price-card
            :price="predictedPrice"
            :dollarRate="rate"
            v-if="shouldShowPredictedPriceCard"
          />
        </transition>
      </el-main>
      <el-footer class="app-footer">
        <p>
          Basado en
          <a
            href="https://docs.google.com/spreadsheets/d/1R8RQ28INLV1ugQGe4kwfwwOx4LsadlQlmuh3PqTVA1A"
            target="_blank"
            rel="noopener"
            >este spreadsheet</a
          >
          de Alejandro Feltes
        </p>
        <p>
          Cotización gracias a
          <a href="https://dolar.melizeche.com/" target="_blank" rel="noopener"
            >Dolar Py</a
          >
          de Marce Elizeche
        </p>
        <p>2019 - Guillermo Peralta</p>
        <small id="disclaimer"
          ><strong>Atención: </strong> Costos no garantizados. Consultar con
          cada empresa en específico para conocer el precio final. Precios de
          referencia sólo válidos para Asunción.</small
        >
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Container, Main, Footer } from "element-ui";

import PriceForm from "./components/PriceForm.vue";

export default Vue.extend({
  name: "app",
  components: {
    [Container.name]: Container,
    [Main.name]: Main,
    [Footer.name]: Footer,
    PriceForm,
    "predicted-price-card": () => import("./components/PredictedPriceCard.vue")
  },
  data() {
    return {
      predictedPrice: {
        itemPrice: 0,
        usShippingCost: 0,
        taxes: 0,
        shippingCost: 0
      },
      rate: 0
    };
  },
  async created() {
    const {
      dolarpy: {
        cambioschaco: { venta: rate }
      }
    } = await (await fetch("https://dolar.melizeche.com/api/1.0/")).json();
    this.rate = rate;
  },
  computed: {
    shouldShowPredictedPriceCard(): boolean {
      return Boolean(this.predictedPrice.shippingCost);
    }
  },
  watch: {
    shouldShowPredictedPriceCard(value) {
      if (value && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
    }
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

.app-footer {
  margin-top: 100px;
}
#disclaimer {
  padding-bottom: 50px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <el-card class="box-card">
    <h2>
      USD $<strong>{{ price | currency(2) }}</strong>
    </h2>
    <transition name="fade">
      <h3 v-if="priceGuaranies">(Gs. {{ priceGuaranies | currency(0) }})</h3>
    </transition>
  </el-card>
</template>
<script lang="ts">
import Vue from "vue";
import { Card } from "element-ui";

export default Vue.extend({
  components: {
    [Card.name]: Card
  },
  props: {
    price: Number
  },
  data() {
    return {
      rate: 0
    };
  },
  computed: {
    priceGuaranies(): number {
      return this.price * this.rate;
    }
  },
  async created() {
    const {
      dolarpy: {
        cambioschaco: { venta: rate }
      }
    } = await (await fetch("https://dolar.melizeche.com/api/1.0/")).json();
    this.rate = rate;
  },
  filters: {
    currency(value: number, decimals: number) {
      return value.toLocaleString("es-PY", { maximumFractionDigits: decimals });
    }
  }
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

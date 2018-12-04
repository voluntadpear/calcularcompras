<template>
  <el-card class="box-card">
    <h2>Precio a pagar: <strong>{{price}}</strong></h2>
    <h3>Gs. {{priceGuaranies}}</h3>
  </el-card>
</template>
<script lang="ts">
import Vue from 'vue';
import {Card} from 'element-ui';

export default Vue.extend({
  components: {
    [Card.name]: Card,
  },
  props: {
    price: Number,
  },
  data() {
    return {
      rate: 0,
    };
  },
  computed: {
    priceGuaranies(): number {
      return this.price * this.rate;
    },
  },
  async created() {
    const {dolarpy: {cambioschaco: {venta: rate}}} = await (await (fetch('https://dolar.melizeche.com/api/1.0/'))).json();
    this.rate = rate;
  },
});
</script>


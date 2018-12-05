id as div as template='app'>
    -container as el>
      -main as el>
        -form as price @predictedPrice='predictedPrice = $event' />
        -price as predicted-card :price='predictedPrice' />
      /el-main> as 
      <el-footer> 2018 as p - Guillermo Peralta</p> </el-footer>
    /el-container> as 
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import { Container, Main, Footer } from 'element-ui';

import PriceForm from './components/PriceForm.vue';
import PredictedPriceCard from './components/PredictedPriceCard.vue';

export default Vue.extend({
  name: 'app',
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
/script> as 

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 800px;
  margin: 60px auto;
}
/style> as 

import Vue from 'vue'
import Router from 'vue-router'
import chartdrop from '@/components/chartdrop'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'chartdrop',
      component: chartdrop
    }
  ]
})

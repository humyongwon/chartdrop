<template>
  <div class="chartdrop">
    <div style="width: 100%; height: 600px">
      <!-- 所有图表共用一个echarts -->
      <div
        v-if="showChart"
        style="width: 100%; height: 300px"
        ref="chart"
      ></div>
      <!-- 表格 -->
      <div v-if="showTable">
        <a-table :columns="tableColumns" :data-source="tableData">
          <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
          <span slot="tags" slot-scope="tags">
            <a-tag
              v-for="tag in tags"
              :key="tag"
              :color="
                tag === 'loser'
                  ? 'volcano'
                  : tag.length > 5
                  ? 'geekblue'
                  : 'green'
              "
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">
              More actions <a-icon type="down" />
            </a>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
// import echarts from "echarts";
const echarts = require("echarts");
// require("echarts/theme/macarons"); // echarts theme

// 表格：表头与数据
const tableColumns = [
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" },
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
const tableData = [];

export default {
  name: "chartdrop",
  props: {
    className: {
      type: String,
      default: "chartAnalysisPie",
    },
    width: {
      type: String,
      default: "50%",
    },
    height: {
      type: String,
      default: "150px",
    },
  },
  data() {
    return {
      tableData,
      tableColumns,
      showChart: true,
      showTable: false,
      showTable: false,
      chart: null,
      // isShowBack: false, // 是否显示返回上一级
      currentOption: null,
      chartOptions: [
        // 饼图数据格式
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: 15,
            itemWidth: 14,
            textStyle: {
              color: "rgba(132, 214, 255, 1)",
            },
          },
          series: [
            {
              name: "工厂分类",
              type: "pie",
              radius: "80%",
              center: ["50%", "50%"],
              data: [],
              label: {
                position: "inside",
                formatter: "{c}",
                // formatter: "{c}件\n{d}%",
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
        // 柱状图数据格式
        {
          title: {
            text: "第一个 ECharts 实例",
          },
          tooltip: {},
          legend: {
            data: ["销量"],
          },
          xAxis: {
            // data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
            data: [],
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              // data: [5, 20, 36, 10, 10, 20],
              data: [],
            },
          ],
        },
        // 折线图数据
        {
          xAxis: {
            type: "category",
            data: [
              // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
            ],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "折线图",
              data: [
                // 150, 230, 224, 218, 135, 147, 260
              ],
              type: "line",
            },
          ],
        },
      ],
    };
  },

  mounted() {
    this.firstData();
    // this.getAllData();
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 第一层级的数据赋值
    firstData() {
      this.chartOptions[0].series[0].data = [
        { value: 66, name: "寄递行业" },
        { value: 66, name: "服装" },
        { value: 66, name: "餐饮 " },
        { value: 66, name: "建材" },
      ];
    },
    // 一次性获取全部数据(通常业务中不是这样设计的)
    // getAllData() {
    //   let that = this;
    //   axios
    //     .get("../../static/all.json", {})
    //     .then(function (res) {
    //       // 组装饼图数据
    //       that.chartOptions[0].series[0].data = res.data.data.pie_data;
    //       // 组装柱状图数据
    //       that.chartOptions[1].xAxis.data = res.data.data.bar_xAxis;
    //       that.chartOptions[1].series[0].data = res.data.data.bar_data;
    //       // 初始化图表
    //       that.initChart();
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // },

    // 获取饼图数据
    getPie(clickParams) {
      this.chart.clear();
      let that = this;
      axios
        .get("../../static/all.json", clickParams)
        .then(function (res) {
          // 第二层级，同样是饼图，要把层级名改动，以便点击跳入第三层级
          that.chartOptions[0].series[0].name = "工厂分类2";
          that.chartOptions[0].series[0].data = res.data.data.pie_data;
          // 渲染下一层级图表
          that.renderChart(that.chart, that.chartOptions[0]);
        })
        .catch(function (error) {
          console.log(error);
        });
      // }
    },
    // 获取柱状图数据
    getBar(clickParams) {
      this.chart.clear();
      let that = this;
      axios
        .get("../../static/all.json", clickParams)
        .then(function (res) {
          that.chartOptions[1].xAxis.data = res.data.data.bar_xAxis;
          that.chartOptions[1].series[0].data = res.data.data.bar_data;
          // 渲染下一层级图表
          that.renderChart(that.chart, that.chartOptions[1]);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取折线图数据
    getLine(clickParams) {
      this.chart.clear();
      let that = this;
      axios
        .get("../../static/all.json", clickParams)
        .then(function (res) {
          that.chartOptions[2].series[0].data = res.data.data.line_data;
          // 渲染下一层级图表
          that.renderChart(that.chart, that.chartOptions[2]);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    initChart() {
      // this.chart = echarts.init(this.$el);
      this.chart = echarts.init(this.$refs.chart);
      // 设饼图为第一层级
      this.currentOption = this.chartOptions[0];
      // setOption的方法
      this.renderChart(this.chart, this.currentOption);
      // 后接echarts点击事件
      this.chart.on("click", this.handleClick);
    },

    // 【复用】渲染图表的方法
    renderChart(chartInstance, option) {
      // 该方法第一个参数是图表名称，第二个参数是数据配置项
      chartInstance.setOption(option);
    },

    // echarts点击方法
    handleClick(params) {
      console.log(this, params);
      // 实际上会把params.seriesName和params.name当做入参传给接口
      // 线索：data、dataIndex、name、seriesIndex、value
      let clickParams = { seriesName: params.seriesName, name: params.name };
      // 由于seriesName是元数据，可以用seriesName判断点击的是哪个层级的图
      if (clickParams.seriesName == "工厂分类") {
        this.getPie();
      } else if (clickParams.seriesName == "工厂分类2") {
        this.getBar();
      } else if (clickParams.seriesName == "销量") {
        this.getLine(clickParams);
      } else {
        this.chart.clear();
        this.showChart = false;
        this.initTable();
      }
    },

    // 获取表格数据
    initTable() {
      let that = this;
      axios
        .get("../../static/all.json", {})
        .then(function (res) {
          that.tableData = res.data.data.tableData;
          // 将隐藏的表格显示出来
          that.showTable = true;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

v<template>
  <div>
    <div ref="charRef" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from "vue";
import * as echarts from "echarts";

export default defineComponent({
  setup() {
    const charRef = ref(null);
    let chartInstance = ref(null);

    const ROOT_PATH =
      "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples";

    const _panelImageURL = ROOT_PATH + "/data/asset/img/custom-gauge-panel.png";
    const _animationDuration = 1000;
    const _animationDurationUpdate = 1000;
    const _animationEasingUpdate = "quarticInOut";
    const _valOnRadianMax = 200;
    const _outerRadius = 200;
    const _innerRadius = 170;
    const _pointerInnerRadius = 40;
    const _insidePanelRadius = 140;
    const _currentDataIndex = 0;

    function renderItem(params, api) {
      var valOnRadian = api.value(1);
      var coords = api.coord([api.value(0), valOnRadian]);
      // console.log(api.value(0), api.value(1), coords);
      var polarEndRadian = coords[3];
      var imageStyle = {
        image: _panelImageURL,
        x: params.coordSys.cx - _outerRadius,
        y: params.coordSys.cy - _outerRadius,
        width: _outerRadius * 2,
        height: _outerRadius * 2,
      };

      return {
        type: "group",
        children: [
          {
            type: "image",
            style: imageStyle,
            clipPath: {
              type: "sector",
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _outerRadius,
                r0: _innerRadius,
                startAngle: 0,
                endAngle: -polarEndRadian,
                transition: "endAngle",
                enterFrom: { endAngle: 0 },
              },
            },
          },
          {
            type: "image",
            style: imageStyle,
            clipPath: {
              type: "polygon",
              shape: {
                points: makePionterPoints(params, polarEndRadian),
              },
              extra: {
                polarEndRadian: polarEndRadian,
                transition: "polarEndRadian",
                enterFrom: { polarEndRadian: 0 },
              },
              during: function (apiDuring) {
                apiDuring.setShape(
                  "points",
                  makePionterPoints(
                    params,
                    apiDuring.getExtra("polarEndRadian")
                  )
                );
              },
            },
          },
          {
            type: "circle",
            shape: {
              cx: params.coordSys.cx,
              cy: params.coordSys.cy,
              r: _insidePanelRadius,
            },
            style: {
              fill: "#fff",
              shadowBlur: 25,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(76,107,167,0.4)",
            },
          },
          {
            type: "text",
            extra: {
              valOnRadian: valOnRadian,
              transition: "valOnRadian",
              enterFrom: { valOnRadian: 0 },
            },
            style: {
              text: makeText(valOnRadian),
              fontSize: 50,
              fontWeight: 700,
              x: params.coordSys.cx,
              y: params.coordSys.cy,
              fill: "rgb(0,50,190)",
              align: "center",
              verticalAlign: "middle",
              enterFrom: { opacity: 0 },
            },
            during: function (apiDuring) {
              apiDuring.setStyle(
                "text",
                makeText(apiDuring.getExtra("valOnRadian"))
              );
            },
          },
        ],
      };
    }

    function convertToPolarPoint(renderItemParams, radius, radian) {
      return [
        Math.cos(radian) * radius + renderItemParams.coordSys.cx,
        -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
      ];
    }

    function makePionterPoints(renderItemParams, polarEndRadian) {
      return [
        convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
        convertToPolarPoint(
          renderItemParams,
          _outerRadius,
          polarEndRadian + Math.PI * 0.03
        ),
        convertToPolarPoint(
          renderItemParams,
          _pointerInnerRadius,
          polarEndRadian
        ),
      ];
    }

    function makeText(valOnRadian) {
      // Validate additive animation calc.
      if (valOnRadian < -10) {
        alert("illegal during val: " + valOnRadian);
      }
      return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + "%";
    }

    onMounted(() => {
      chartInstance.vaule = echarts.init(charRef.value);
      console.log(chartInstance);

      chartInstance.value.setOption({
        animationEasing: _animationEasingUpdate,
        animationDuration: _animationDuration,
        animationDurationUpdate: _animationDurationUpdate,
        animationEasingUpdate: _animationEasingUpdate,
        dataset: {
          source: [[1, 156]],
        },
        tooltip: {},
        angleAxis: {
          type: "value",
          startAngle: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
          min: 0,
          max: _valOnRadianMax,
        },
        radiusAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
        polar: {},
        series: [
          {
            type: "custom",
            coordinateSystem: "polar",
            renderItem: renderItem,
          },
        ],
      });

      setInterval(function () {
        const nextSource = [[1, Math.round(Math.random() * _valOnRadianMax)]];
        console.log(nextSource);
        chartInstance.value.setOption({
          dataset: {
            source: nextSource,
          },
        });
      }, 3000);
    });

    return { charRef };
  },
});
</script>

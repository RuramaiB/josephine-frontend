<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        display: true,
        color: 'rgba(15, 23, 42, 0.05)'
      },
      grid: {
         color: 'rgba(15, 23, 42, 0.05)'
      },
      pointLabels: {
        font: {
          size: 10,
          weight: 'bold'
        },
        color: '#64748b'
      },
      ticks: {
        display: false
      },
      suggestedMin: 0,
      suggestedMax: 100
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 10 },
      padding: 12,
      cornerRadius: 12,
      displayColors: false
    }
  }
}
</script>

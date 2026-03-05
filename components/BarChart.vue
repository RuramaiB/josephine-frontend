<template>
  <div class="relative w-full h-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
          padding: 12,
          cornerRadius: 12
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 10, weight: 'bold' }
          }
        },
        y: {
          grid: {
            color: '#f1f5f9'
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 10, weight: 'bold' },
            callback: (value) => '$' + value
          }
        }
      }
    })
  }
})
</script>

<template>
  <v-card class="mt-6">
    <v-card-title>Gestión de stock por talla</v-card-title>
    <v-card-text>
      <v-alert v-if="!mppId" type="info" variant="tonal" class="mb-4"
        >Selecciona un EPP para gestionar stock.</v-alert
      >

      <template v-else>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="tallaId"
              :items="tallas"
              item-title="valor"
              item-value="id"
              label="Talla"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="cantidad"
              type="number"
              min="0"
              label="Cantidad"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center ga-2">
            <v-btn color="primary" :disabled="!canSubmit" @click="emitSetStock"
              >Set stock</v-btn
            >
            <v-btn color="success" :disabled="!canSubmit" @click="emitIngreso"
              >Ingreso</v-btn
            >
            <v-btn color="warning" :disabled="!canSubmit" @click="emitRetiro"
              >Retiro</v-btn
            >
          </v-col>
        </v-row>

        <v-table>
          <thead>
            <tr>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in stocks" :key="`${stock.mpp_id}-${stock.talla_id}`">
              <td>{{ getTallaLabel(stock.talla_id) }}</td>
              <td>{{ stock.cantidad }}</td>
              <td>
                <v-btn size="small" color="error" variant="text" @click="$emit('delete-stock', stock)"
                  >Eliminar</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { MppStock } from '@/modules/mpps/api/mpps.service'

interface TallaOption {
  id: number
  valor: string
}

const props = defineProps<{
  mppId: number | null
  stocks: MppStock[]
  tallas: TallaOption[]
}>()

const emit = defineEmits<{
  (e: 'set-stock', payload: { tallaId: number; cantidad: number }): void
  (e: 'ingreso', payload: { tallaId: number; cantidad: number }): void
  (e: 'retiro', payload: { tallaId: number; cantidad: number }): void
  (e: 'delete-stock', stock: MppStock): void
}>()

const tallaId = ref<number | null>(null)
const cantidad = ref(0)

const canSubmit = computed(() => Boolean(tallaId.value) && cantidad.value >= 0)

function getTallaLabel(id: number) {
  return props.tallas.find((t) => t.id === id)?.valor ?? `#${id}`
}

function emitSetStock() {
  if (!tallaId.value) return
  emit('set-stock', { tallaId: tallaId.value, cantidad: cantidad.value })
}

function emitIngreso() {
  if (!tallaId.value) return
  emit('ingreso', { tallaId: tallaId.value, cantidad: cantidad.value })
}

function emitRetiro() {
  if (!tallaId.value) return
  emit('retiro', { tallaId: tallaId.value, cantidad: cantidad.value })
}
</script>

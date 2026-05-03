<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-select
        v-model="trabajadorId"
        :items="trabajadores"
        item-title="nombre"
        item-value="id"
        label="Trabajador"
        variant="outlined"
        :error-messages="errors.trabajador_id ? [errors.trabajador_id] : []"
      />
    </v-col>
    <v-col cols="12">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-subtitle-1">EPPs a asignar</span>
        <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="addItem">
          Agregar EPP
        </v-btn>
      </div>
      <v-card variant="outlined">
        <v-list lines="one">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :title="`EPP #${index + 1}`"
          >
            <template #append>
              <v-btn
                v-if="items.length > 1"
                size="small"
                variant="text"
                icon="mdi-delete"
                color="error"
                @click="removeItem(index)"
              />
            </template>
            <template #default>
              <v-row dense class="mt-1">
                <v-col cols="12" :md="item.requiere_talla ? 6 : 12">
                  <v-select
                    v-model="item.mpp_id"
                    :items="mpps"
                    item-title="nombre"
                    item-value="id"
                    label="EPP"
                    variant="outlined"
                    density="compact"
                    :error-messages="getErrors(index, 'mpp_id')"
                    @update:model-value="onMppChange(index)"
                  />
                </v-col>
                <v-col v-if="item.requiere_talla" cols="12" md="6">
                  <v-select
                    v-model="item.talla_id"
                    :items="getTallasFiltradas(item.mpp_id)"
                    item-title="valor"
                    item-value="id"
                    label="Talla"
                    variant="outlined"
                    density="compact"
                    :error-messages="getErrors(index, 'talla_id')"
                  />
                </v-col>
              </v-row>
            </template>
          </v-list-item>
          <v-list-item v-if="items.length === 0">
            <v-list-item-title class="text-grey text-center">
              No hay EPPs agregados. Haz clic en "Agregar EPP" para comenzar.
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
      <div v-if="errors.items" class="text-error text-caption mt-1">{{ errors.items }}</div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Mpp } from '@/modules/mpps/api/mpps.service'
import type { Talla } from '@/modules/tallas/api/tallas.service'

const props = defineProps<{
  trabajadores: Array<{ id: number; nombre: string }>
  mpps: Mpp[]
  tallas: Talla[]
  errors: Record<string, string | undefined>
}>()

interface FormItem {
  mpp_id: number
  talla_id: number | null
  requiere_talla: boolean
}

const trabajadorId = defineModel<number>('trabajadorId', { required: true })
const items = defineModel<FormItem[]>('items', { required: true })

function getTallasFiltradas(mppId: number): Talla[] {
  const mpp = props.mpps.find((m) => m.id === mppId)
  if (!mpp || mpp.tipo_talla === 'sin_talla') return []
  return props.tallas.filter((t) => t.tipo === mpp.tipo_talla || t.tipo === 'otro')
}

function addItem() {
  items.value = [
    ...items.value,
    { mpp_id: 0, talla_id: null, requiere_talla: false },
  ]
}

function removeItem(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}

function onMppChange(index: number) {
  const item = items.value[index]
  if (!item) return
  const mpp = props.mpps.find((m) => m.id === item.mpp_id)
  const requiereTalla = mpp?.tipo_talla !== 'sin_talla'
  const newItem: FormItem = {
    mpp_id: item.mpp_id,
    talla_id: requiereTalla ? item.talla_id : null,
    requiere_talla: requiereTalla,
  }
  const updated = [...items.value]
  updated[index] = newItem
  items.value = updated
}

function getErrors(index: number, field: 'mpp_id' | 'talla_id'): string[] {
  const key = `items[${index}].${field}`
  const msg = props.errors[key]
  return msg ? [msg] : []
}
</script>

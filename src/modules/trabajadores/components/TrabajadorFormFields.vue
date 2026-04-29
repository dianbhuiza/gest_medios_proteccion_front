<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="nombre"
        label="Nombre"
        variant="outlined"
        :error-messages="errors.nombre ? [errors.nombre] : []"
        required
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="areaId"
        label="Área"
        :items="areas"
        item-title="nombre"
        item-value="id"
        variant="outlined"
        :error-messages="errors.area_id ? [errors.area_id] : []"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="cargoId"
        label="Cargo"
        :items="cargos"
        item-title="nombre"
        item-value="id"
        variant="outlined"
        :error-messages="errors.cargo_id ? [errors.cargo_id] : []"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="tallaOverolId"
        label="Talla overol"
        :items="tallasOverol"
        item-title="valor"
        item-value="id"
        variant="outlined"
        :error-messages="errors.talla_overol_id ? [errors.talla_overol_id] : []"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="tallaBotasId"
        label="Talla botas"
        :items="tallasBotas"
        item-title="valor"
        item-value="id"
        variant="outlined"
        :error-messages="errors.talla_botas_id ? [errors.talla_botas_id] : []"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CatalogItem {
  id: number
  nombre?: string
  valor?: string
  tipo?: string
}

const props = defineProps<{
  areas: CatalogItem[]
  cargos: CatalogItem[]
  tallas: CatalogItem[]
  errors: Record<string, string | undefined>
}>()

const nombre = defineModel<string>('nombre', { required: true })
const areaId = defineModel<number>('areaId', { required: true })
const cargoId = defineModel<number>('cargoId', { required: true })
const tallaOverolId = defineModel<number>('tallaOverolId', { required: true })
const tallaBotasId = defineModel<number>('tallaBotasId', { required: true })

const tallasOverol = computed(() =>
  props.tallas.filter((item) => item.tipo === 'overol' || item.tipo === 'otro'),
)
const tallasBotas = computed(() =>
  props.tallas.filter((item) => item.tipo === 'botas' || item.tipo === 'otro'),
)
</script>

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
      <v-autocomplete
        v-model="subAreaModel"
        v-model:search="subAreaSearch"
        label="Sub área"
        :placeholder="subAreaPlaceholder"
        :items="subAreasLoading ? [] : subAreas"
        :item-title="formatSubAreaLabel"
        item-value="id"
        :loading="subAreasLoading"
        :no-filter="true"
        variant="outlined"
        :error-messages="errors.sub_area_id ? [errors.sub_area_id] : []"
        @focus="isSubAreaFocused = true"
        @blur="isSubAreaFocused = false"
      >
        <template #no-data>
          <v-list-item v-if="subAreasLoading" density="comfortable">
            <template #prepend>
              <v-progress-circular indeterminate size="18" width="2" color="primary" />
            </template>
            <v-list-item-title>Cargando sub áreas...</v-list-item-title>
          </v-list-item>
          <v-list-item v-else density="comfortable">
            <v-list-item-title>Sin coincidencias</v-list-item-title>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="12" md="6">
      <v-autocomplete
        v-model="cargoModel"
        v-model:search="cargoSearch"
        label="Cargo"
        :placeholder="cargoPlaceholder"
        :items="cargosLoading ? [] : cargos"
        item-title="nombre"
        item-value="id"
        :loading="cargosLoading"
        :no-filter="true"
        variant="outlined"
        :error-messages="errors.cargo_id ? [errors.cargo_id] : []"
        @focus="isCargoFocused = true"
        @blur="isCargoFocused = false"
      >
        <template #no-data>
          <v-list-item v-if="cargosLoading" density="comfortable">
            <template #prepend>
              <v-progress-circular indeterminate size="18" width="2" color="primary" />
            </template>
            <v-list-item-title>Cargando cargos...</v-list-item-title>
          </v-list-item>
          <v-list-item v-else density="comfortable">
            <v-list-item-title>Sin coincidencias</v-list-item-title>
          </v-list-item>
        </template>
        <template #append-item>
          <v-divider class="my-1" />
          <v-list-item
            density="comfortable"
            :title="createCargoTitle"
            prepend-icon="mdi-plus-circle"
            class="text-success"
            @click="emitCreateCargo"
          />
        </template>
      </v-autocomplete>
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
import { computed, ref } from 'vue'

interface SubAreaItem {
  id: number
  nombre: string
  area_id: number
  area_nombre?: string
}

interface CatalogItem {
  id: number
  nombre?: string
  valor?: string
  tipo?: string
}

const props = defineProps<{
  subAreas: SubAreaItem[]
  subAreasLoading: boolean
  cargos: CatalogItem[]
  cargosLoading: boolean
  tallas: CatalogItem[]
  errors: Record<string, string | undefined>
}>()

const emit = defineEmits<{
  createCargo: [nombre: string]
}>()

const nombre = defineModel<string>('nombre', { required: true })
const subAreaId = defineModel<number>('subAreaId', { required: true })
const subAreaSearch = defineModel<string>('subAreaSearch', { default: '' })
const cargoId = defineModel<number>('cargoId', { required: true })
const cargoSearch = defineModel<string>('cargoSearch', { default: '' })
const tallaOverolId = defineModel<number>('tallaOverolId', { required: true })
const tallaBotasId = defineModel<number>('tallaBotasId', { required: true })

const isSubAreaFocused = ref(false)
const isCargoFocused = ref(false)

const subAreaPlaceholder = computed(() => (isSubAreaFocused.value ? '' : 'Escribe para buscar sub área'))
const cargoPlaceholder = computed(() => (isCargoFocused.value ? '' : 'Ej: Gerente'))

const subAreaModel = computed<number | null>({
  get: () => (subAreaId.value > 0 ? subAreaId.value : null),
  set: (value) => {
    subAreaId.value = Number(value ?? 0)
  },
})

const cargoModel = computed<number | null>({
  get: () => (cargoId.value > 0 ? cargoId.value : null),
  set: (value) => {
    cargoId.value = Number(value ?? 0)
  },
})

function formatSubAreaLabel(item: SubAreaItem) {
  return `${item.nombre} - [${item.area_nombre ?? 'Sin área'}]`
}

const createCargoTitle = computed(() => {
  const trimmed = cargoSearch.value.trim()
  return trimmed ? `Crear cargo: ${trimmed}` : 'Crear cargo'
})

function emitCreateCargo() {
  const trimmed = cargoSearch.value.trim()
  if (!trimmed) return
  emit('createCargo', trimmed)
}

const tallasOverol = computed(() =>
  props.tallas.filter((item) => item.tipo === 'overol' || item.tipo === 'otro'),
)
const tallasBotas = computed(() =>
  props.tallas.filter((item) => item.tipo === 'botas' || item.tipo === 'otro'),
)
</script>

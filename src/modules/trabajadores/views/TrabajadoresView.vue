<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Trabajadores</h2>

    <EntityTable
      :columns="columns"
      :items="tableItems"
      :loading="trabajadoresQuery.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="trabajadoresQuery.data.value?.meta.total ?? 0"
      :total-pages="trabajadoresQuery.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nuevo trabajador</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit((item as unknown as { raw: Trabajador }).raw)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete((item as unknown as { raw: Trabajador }).raw)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <EntityDialog
      v-model="dialogOpen"
      :title="dialogTitle"
      :loading="isSaving"
      @save="onSave"
    >
      <TrabajadorFormFields
        v-model:nombre="nombre"
        v-model:sub-area-id="sub_area_id"
        v-model:sub-area-search="subAreaSearch"
        v-model:cargo-id="cargo_id"
        v-model:cargo-search="cargoSearch"
        v-model:talla-overol-id="talla_overol_id"
        v-model:talla-botas-id="talla_botas_id"
        :sub-areas="subAreaAutocompleteOptions"
        :sub-areas-loading="isSubAreaSearchLoading"
        :cargos="cargoAutocompleteOptions"
        :cargos-loading="isCargoSearchLoading || createCargoMutation.isPending.value"
        :tallas="tallasQuery.data.value?.results ?? []"
        :errors="errors"
        @create-cargo="handleCreateCargo"
      />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar trabajador"
      message="¿Seguro que deseas eliminar este trabajador?"
      :loading="deleteMutation.isPending.value"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { normalizeHttpError } from '@/core/http/error'
import { cargosService } from '@/modules/cargos/api/cargos.service'
import {
  type Trabajador,
  type TrabajadorPayload,
} from '@/modules/trabajadores/api/trabajadores.service'
import TrabajadorFormFields from '@/modules/trabajadores/components/TrabajadorFormFields.vue'
import {
  useCreateTrabajadorMutation,
  useDeleteTrabajadorMutation,
  useUpdateTrabajadorMutation,
} from '@/modules/trabajadores/mutations/useTrabajadoresMutations'
import {
  trabajadoresCatalogKeys,
  useCargosAutocompleteQuery,
  useSubAreasAutocompleteQuery,
  useSubAreasOptionsQuery,
  useCargosOptionsQuery,
  useTallasOptionsQuery,
  useTrabajadoresListQuery,
} from '@/modules/trabajadores/queries/useTrabajadoresQueries'
import {
  trabajadorSchema,
  type TrabajadorFormValues,
} from '@/modules/trabajadores/schemas/trabajador.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')
const subAreaSearch = ref('')
const debouncedSubAreaSearch = ref('')
const cargoSearch = ref('')
const debouncedCargoSearch = ref('')

const trabajadoresQuery = useTrabajadoresListQuery(page, pageSize)
const subAreasQuery = useSubAreasOptionsQuery()
const subAreasAutocompleteQuery = useSubAreasAutocompleteQuery(debouncedSubAreaSearch)
const cargosQuery = useCargosOptionsQuery()
const cargosAutocompleteQuery = useCargosAutocompleteQuery(debouncedCargoSearch)
const tallasQuery = useTallasOptionsQuery()

const createMutation = useCreateTrabajadorMutation()
const updateMutation = useUpdateTrabajadorMutation()
const deleteMutation = useDeleteTrabajadorMutation()
const queryClient = useQueryClient()
const createCargoMutation = useMutation({
  mutationFn: (nombre: string) => cargosService.create({ nombre }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: trabajadoresCatalogKeys.cargos })
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => queryKey[0] === 'catalogos' && queryKey[1] === 'cargos',
    })
  },
})

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Trabajador | null>(null)
const selectedToDelete = ref<Trabajador | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<TrabajadorFormValues>({
  validationSchema: toTypedSchema(trabajadorSchema),
  initialValues: {
    nombre: '',
    sub_area_id: 0,
    cargo_id: 0,
    talla_overol_id: 0,
    talla_botas_id: 0,
  },
})

const [nombre] = defineField('nombre')
const [sub_area_id] = defineField('sub_area_id')
const [cargo_id] = defineField('cargo_id')
const [talla_overol_id] = defineField('talla_overol_id')
const [talla_botas_id] = defineField('talla_botas_id')

const columns: EntityTableColumn[] = [
  { key: 'nombre', title: 'Nombre' },
  { key: 'sub_area', title: 'Sub área' },
  { key: 'cargo', title: 'Cargo' },
  { key: 'talla_overol', title: 'Talla overol' },
  { key: 'talla_botas', title: 'Talla botas' },
]

const subAreaMap = computed(() => new Map((subAreasQuery.data.value?.results ?? []).map((x) => [x.id, x.nombre])))
const cargoMap = computed(() => new Map((cargosQuery.data.value?.results ?? []).map((x) => [x.id, x.nombre])))
const tallaMap = computed(() => new Map((tallasQuery.data.value?.results ?? []).map((x) => [x.id, x.valor])))
const selectedSubArea = computed(() => {
  const selectedId = sub_area_id.value
  if (!selectedId) return undefined

  return (
    subAreasAutocompleteQuery.data.value?.results.find((item) => item.id === selectedId)
    ?? subAreasQuery.data.value?.results.find((item) => item.id === selectedId)
  )
})
const subAreaAutocompleteOptions = computed(() => {
  const optionsMap = new Map<number, { id: number; nombre: string; area_id: number; area_nombre?: string }>()

  for (const item of subAreasAutocompleteQuery.data.value?.results ?? []) {
    optionsMap.set(item.id, item)
  }

  if (selectedSubArea.value) {
    optionsMap.set(selectedSubArea.value.id, selectedSubArea.value)
  }

  return Array.from(optionsMap.values())
})
const selectedCargo = computed(() => {
  const selectedId = cargo_id.value
  if (!selectedId) return undefined

  return (
    cargosAutocompleteQuery.data.value?.results.find((item) => item.id === selectedId)
    ?? cargosQuery.data.value?.results.find((item) => item.id === selectedId)
  )
})
const cargoAutocompleteOptions = computed(() => {
  const optionsMap = new Map<number, { id: number; nombre?: string; valor?: string; tipo?: string }>()

  for (const item of cargosAutocompleteQuery.data.value?.results ?? []) {
    optionsMap.set(item.id, item)
  }

  if (selectedCargo.value) {
    optionsMap.set(selectedCargo.value.id, selectedCargo.value)
  }

  return Array.from(optionsMap.values())
})

const queryError = computed(() => {
  if (!trabajadoresQuery.error.value) return undefined
  return normalizeHttpError(trabajadoresQuery.error.value).message
})
const isSubAreaSearchLoading = computed(() => {
  const trimmedSearch = subAreaSearch.value.trim()
  if (!trimmedSearch) return false

  return debouncedSubAreaSearch.value !== trimmedSearch || subAreasAutocompleteQuery.isFetching.value
})
const isCargoSearchLoading = computed(() => {
  const trimmedSearch = cargoSearch.value.trim()
  if (!trimmedSearch) return false

  return debouncedCargoSearch.value !== trimmedSearch || cargosAutocompleteQuery.isFetching.value
})

const tableItems = computed(() => {
  const items = trabajadoresQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  const mapped = items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    sub_area: subAreaMap.value.get(item.sub_area_id) ?? `#${item.sub_area_id}`,
    cargo: cargoMap.value.get(item.cargo_id) ?? `#${item.cargo_id}`,
    talla_overol: tallaMap.value.get(item.talla_overol_id) ?? `#${item.talla_overol_id}`,
    talla_botas: tallaMap.value.get(item.talla_botas_id) ?? `#${item.talla_botas_id}`,
    raw: item,
  }))

  if (!term) return mapped
  return mapped.filter((item) => item.nombre.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar trabajador' : 'Nuevo trabajador'))

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

let subAreaSearchDebounceTimer: ReturnType<typeof setTimeout> | undefined
watch(subAreaSearch, (value) => {
  if (subAreaSearchDebounceTimer) {
    clearTimeout(subAreaSearchDebounceTimer)
  }

  subAreaSearchDebounceTimer = setTimeout(() => {
    debouncedSubAreaSearch.value = value.trim()
  }, 1300)
})

let cargoSearchDebounceTimer: ReturnType<typeof setTimeout> | undefined
watch(cargoSearch, (value) => {
  if (cargoSearchDebounceTimer) {
    clearTimeout(cargoSearchDebounceTimer)
  }

  cargoSearchDebounceTimer = setTimeout(() => {
    debouncedCargoSearch.value = value.trim()
  }, 1300)
})

onBeforeUnmount(() => {
  if (subAreaSearchDebounceTimer) {
    clearTimeout(subAreaSearchDebounceTimer)
  }
  if (cargoSearchDebounceTimer) {
    clearTimeout(cargoSearchDebounceTimer)
  }
})

function openCreate() {
  editingItem.value = null
  subAreaSearch.value = ''
  debouncedSubAreaSearch.value = ''
  cargoSearch.value = ''
  debouncedCargoSearch.value = ''
  resetForm({
    values: { nombre: '', sub_area_id: 0, cargo_id: 0, talla_overol_id: 0, talla_botas_id: 0 },
  })
  dialogOpen.value = true
}

function openEdit(item: Trabajador) {
  editingItem.value = item
  subAreaSearch.value = ''
  debouncedSubAreaSearch.value = ''
  cargoSearch.value = ''
  debouncedCargoSearch.value = ''
  setValues({
    nombre: item.nombre,
    sub_area_id: item.sub_area_id,
    cargo_id: item.cargo_id,
    talla_overol_id: item.talla_overol_id,
    talla_botas_id: item.talla_botas_id,
  })
  dialogOpen.value = true
}

function openDelete(item: Trabajador) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

async function handleCreateCargo(nombre: string) {
  try {
    const createdCargo = await createCargoMutation.mutateAsync(nombre)
    cargo_id.value = createdCargo.id
    cargoSearch.value = createdCargo.nombre
    debouncedCargoSearch.value = ''
    uiStore.mostrarMensaje('Cargo creado correctamente')
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

const onSave = handleSubmit(async (values) => {
  try {
    const payload: TrabajadorPayload = values

    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload })
      uiStore.mostrarMensaje('Trabajador actualizado correctamente')
    } else {
      await createMutation.mutateAsync(payload)
      uiStore.mostrarMensaje('Trabajador creado correctamente')
    }

    dialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
})

async function confirmDelete() {
  if (!selectedToDelete.value) return

  try {
    await deleteMutation.mutateAsync(selectedToDelete.value.id)
    uiStore.mostrarMensaje('Trabajador eliminado correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

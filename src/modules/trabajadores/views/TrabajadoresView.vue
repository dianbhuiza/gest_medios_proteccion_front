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
        v-model:area-id="area_id"
        v-model:cargo-id="cargo_id"
        v-model:talla-overol-id="talla_overol_id"
        v-model:talla-botas-id="talla_botas_id"
        :areas="areasQuery.data.value?.results ?? []"
        :cargos="cargosQuery.data.value?.results ?? []"
        :tallas="tallasQuery.data.value?.results ?? []"
        :errors="errors"
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
import { computed, ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { normalizeHttpError } from '@/core/http/error'
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
  useAreasOptionsQuery,
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

const trabajadoresQuery = useTrabajadoresListQuery(page, pageSize)
const areasQuery = useAreasOptionsQuery()
const cargosQuery = useCargosOptionsQuery()
const tallasQuery = useTallasOptionsQuery()

const createMutation = useCreateTrabajadorMutation()
const updateMutation = useUpdateTrabajadorMutation()
const deleteMutation = useDeleteTrabajadorMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Trabajador | null>(null)
const selectedToDelete = ref<Trabajador | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<TrabajadorFormValues>({
  validationSchema: toTypedSchema(trabajadorSchema),
  initialValues: {
    nombre: '',
    area_id: 0,
    cargo_id: 0,
    talla_overol_id: 0,
    talla_botas_id: 0,
  },
})

const [nombre] = defineField('nombre')
const [area_id] = defineField('area_id')
const [cargo_id] = defineField('cargo_id')
const [talla_overol_id] = defineField('talla_overol_id')
const [talla_botas_id] = defineField('talla_botas_id')

const columns: EntityTableColumn[] = [
  { key: 'nombre', title: 'Nombre' },
  { key: 'area', title: 'Área' },
  { key: 'cargo', title: 'Cargo' },
  { key: 'talla_overol', title: 'Talla overol' },
  { key: 'talla_botas', title: 'Talla botas' },
]

const areaMap = computed(() => new Map((areasQuery.data.value?.results ?? []).map((x) => [x.id, x.nombre])))
const cargoMap = computed(() => new Map((cargosQuery.data.value?.results ?? []).map((x) => [x.id, x.nombre])))
const tallaMap = computed(() => new Map((tallasQuery.data.value?.results ?? []).map((x) => [x.id, x.valor])))

const queryError = computed(() => {
  if (!trabajadoresQuery.error.value) return undefined
  return normalizeHttpError(trabajadoresQuery.error.value).message
})

const tableItems = computed(() => {
  const items = trabajadoresQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  const mapped = items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    area: areaMap.value.get(item.area_id) ?? `#${item.area_id}`,
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

function openCreate() {
  editingItem.value = null
  resetForm({
    values: { nombre: '', area_id: 0, cargo_id: 0, talla_overol_id: 0, talla_botas_id: 0 },
  })
  dialogOpen.value = true
}

function openEdit(item: Trabajador) {
  editingItem.value = item
  setValues({
    nombre: item.nombre,
    area_id: item.area_id,
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

<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Asignaciones Aseo</h2>

    <EntityTable
      :columns="columns"
      :items="tableItems"
      :loading="query.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="query.data.value?.meta.total ?? 0"
      :total-pages="query.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nueva asignación aseo</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit((item as unknown as { raw: AsignacionAseo }).raw)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete((item as unknown as { raw: AsignacionAseo }).raw)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <EntityDialog
      v-model="dialogOpen"
      :title="dialogTitle"
      :loading="isSaving"
      @save="onSave"
    >
      <AsignacionAseoFormFields
        v-model:trabajador-id="trabajador_id"
        v-model:fecha="fecha"
        v-model:items-json="items_json"
        :trabajadores="trabajadoresQuery.data.value?.results ?? []"
        :hint="hint"
        :errors="errors"
      />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar asignación aseo"
      message="¿Seguro que deseas eliminar esta asignación?"
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
import type {
  AsignacionAseo,
  AsignacionAseoPayload,
} from '@/modules/asignaciones-aseo/api/asignaciones-aseo.service'
import AsignacionAseoFormFields from '@/modules/asignaciones-aseo/components/AsignacionAseoFormFields.vue'
import {
  useCreateAsignacionAseoMutation,
  useDeleteAsignacionAseoMutation,
  useUpdateAsignacionAseoMutation,
} from '@/modules/asignaciones-aseo/mutations/useAsignacionesAseoMutations'
import {
  useAsignacionesAseoListQuery,
  useTrabajadoresCatalogAseoQuery,
} from '@/modules/asignaciones-aseo/queries/useAsignacionesAseoQueries'
import {
  asignacionAseoSchema,
  type AsignacionAseoFormValues,
} from '@/modules/asignaciones-aseo/schemas/asignacion-aseo.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const hint = 'Ejemplo: [{"aseo_id": 1, "cantidad": 3}]'
const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const query = useAsignacionesAseoListQuery(page, pageSize)
const trabajadoresQuery = useTrabajadoresCatalogAseoQuery()

const createMutation = useCreateAsignacionAseoMutation()
const updateMutation = useUpdateAsignacionAseoMutation()
const deleteMutation = useDeleteAsignacionAseoMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<AsignacionAseo | null>(null)
const selectedToDelete = ref<AsignacionAseo | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<AsignacionAseoFormValues>({
  validationSchema: toTypedSchema(asignacionAseoSchema),
  initialValues: {
    trabajador_id: 0,
    fecha: '',
    items_json: '[{"aseo_id": 1, "cantidad": 1}]',
  },
})

const [trabajador_id] = defineField('trabajador_id')
const [fecha] = defineField('fecha')
const [items_json] = defineField('items_json')

const columns: EntityTableColumn[] = [
  { key: 'id', title: 'ID' },
  { key: 'fecha', title: 'Fecha' },
  { key: 'trabajador', title: 'Trabajador' },
  { key: 'items_count', title: 'N° Items' },
]

const trabajadorMap = computed(
  () => new Map((trabajadoresQuery.data.value?.results ?? []).map((item) => [item.id, item.nombre])),
)

const queryError = computed(() => {
  if (!query.error.value) return undefined
  return normalizeHttpError(query.error.value).message
})

const tableItems = computed(() => {
  const items = query.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  const mapped = items.map((item) => ({
    id: item.id,
    fecha: item.fecha,
    trabajador: trabajadorMap.value.get(item.trabajador_id) ?? `#${item.trabajador_id}`,
    items_count: item.items.length,
    raw: item,
  }))

  if (!term) return mapped
  return mapped.filter((item) => `${item.id} ${item.trabajador}`.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() =>
  editingItem.value ? 'Editar asignación aseo' : 'Nueva asignación aseo',
)

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function openCreate() {
  editingItem.value = null
  resetForm({
    values: {
      trabajador_id: 0,
      fecha: '',
      items_json: '[{"aseo_id": 1, "cantidad": 1}]',
    },
  })
  dialogOpen.value = true
}

function openEdit(item: AsignacionAseo) {
  editingItem.value = item
  setValues({
    trabajador_id: item.trabajador_id,
    fecha: item.fecha,
    items_json: JSON.stringify(item.items.map((entry) => ({ aseo_id: entry.aseo_id, cantidad: entry.cantidad }))),
  })
  dialogOpen.value = true
}

function openDelete(item: AsignacionAseo) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    const payload: AsignacionAseoPayload = {
      trabajador_id: values.trabajador_id,
      fecha: values.fecha || undefined,
      items: JSON.parse(values.items_json),
    }

    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload })
      uiStore.mostrarMensaje('Asignación aseo actualizada correctamente')
    } else {
      await createMutation.mutateAsync(payload)
      uiStore.mostrarMensaje('Asignación aseo creada correctamente')
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
    uiStore.mostrarMensaje('Asignación aseo eliminada correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

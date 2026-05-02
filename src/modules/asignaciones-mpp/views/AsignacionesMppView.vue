<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Asignaciones EPP</h2>

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
        <v-btn color="primary" @click="openCreate">Nueva asignación EPP</v-btn>
      </template>

      <template #actions="{ item }">
        <v-menu location="bottom end" attach="body">
          <template #activator="{ props: menuProps }">
            <v-btn size="small" variant="text" icon="mdi-dots-vertical" color="on-surface" v-bind="menuProps" />
          </template>
          <v-list density="compact" nav min-width="150">
            <v-list-item
              prepend-icon="mdi-pencil"
              title="Editar"
              @click="openEdit((item as unknown as { raw: AsignacionMpp }).raw)"
            />
            <v-list-item
              prepend-icon="mdi-delete"
              title="Eliminar"
              class="text-error"
              @click="openDelete((item as unknown as { raw: AsignacionMpp }).raw)"
            />
          </v-list>
        </v-menu>
      </template>
    </EntityTable>

    <EntityDialog
      v-model="dialogOpen"
      :title="dialogTitle"
      :loading="isSaving"
      @save="onSave"
    >
      <AsignacionMppFormFields
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
      title="Eliminar asignación EPP"
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
  AsignacionMpp,
  AsignacionMppPayload,
} from '@/modules/asignaciones-mpp/api/asignaciones-mpp.service'
import AsignacionMppFormFields from '@/modules/asignaciones-mpp/components/AsignacionMppFormFields.vue'
import {
  useCreateAsignacionMppMutation,
  useDeleteAsignacionMppMutation,
  useUpdateAsignacionMppMutation,
} from '@/modules/asignaciones-mpp/mutations/useAsignacionesMppMutations'
import {
  useAsignacionesMppListQuery,
  useTrabajadoresCatalogQuery,
} from '@/modules/asignaciones-mpp/queries/useAsignacionesMppQueries'
import {
  asignacionMppSchema,
  type AsignacionMppFormValues,
} from '@/modules/asignaciones-mpp/schemas/asignacion-mpp.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const hint = 'Ejemplo: [{"mpp_id": 1, "talla_id": 2}]'
const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const query = useAsignacionesMppListQuery(page, pageSize)
const trabajadoresQuery = useTrabajadoresCatalogQuery()

const createMutation = useCreateAsignacionMppMutation()
const updateMutation = useUpdateAsignacionMppMutation()
const deleteMutation = useDeleteAsignacionMppMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<AsignacionMpp | null>(null)
const selectedToDelete = ref<AsignacionMpp | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<AsignacionMppFormValues>({
  validationSchema: toTypedSchema(asignacionMppSchema),
  initialValues: {
    trabajador_id: 0,
    fecha: '',
    items_json: '[{"mpp_id": 1, "talla_id": 1}]',
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
  editingItem.value ? 'Editar asignación EPP' : 'Nueva asignación EPP',
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
      items_json: '[{"mpp_id": 1, "talla_id": 1}]',
    },
  })
  dialogOpen.value = true
}

function openEdit(item: AsignacionMpp) {
  editingItem.value = item
  setValues({
    trabajador_id: item.trabajador_id,
    fecha: item.fecha,
    items_json: JSON.stringify(item.items.map((entry) => ({ mpp_id: entry.mpp_id, talla_id: entry.talla_id }))),
  })
  dialogOpen.value = true
}

function openDelete(item: AsignacionMpp) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    const payload: AsignacionMppPayload = {
      trabajador_id: values.trabajador_id,
      fecha: values.fecha || undefined,
      items: JSON.parse(values.items_json),
    }

    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload })
      uiStore.mostrarMensaje('Asignación EPP actualizada correctamente')
    } else {
      await createMutation.mutateAsync(payload)
      uiStore.mostrarMensaje('Asignación EPP creada correctamente')
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
    uiStore.mostrarMensaje('Asignación EPP eliminada correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Áreas</h2>

    <EntityTable
      :columns="columns"
      :items="filteredItems"
      :loading="areasQuery.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="areasQuery.data.value?.meta.total ?? 0"
      :total-pages="areasQuery.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nueva área</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit(item as unknown as Area)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item as unknown as Area)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <EntityDialog v-model="dialogOpen" :title="dialogTitle" :loading="isSaving" @save="onSave">
      <AreaFormFields v-model:nombre="nombre" :error="errors.nombre" />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar área"
      message="¿Seguro que deseas eliminar esta área?"
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
import AreaFormFields from '@/modules/areas/components/AreaFormFields.vue'
import { type Area } from '@/modules/areas/api/areas.service'
import {
  useCreateAreaMutation,
  useDeleteAreaMutation,
  useUpdateAreaMutation,
} from '@/modules/areas/mutations/useAreasMutations'
import { useAreasListQuery } from '@/modules/areas/queries/useAreasQueries'
import { areaSchema, type AreaFormValues } from '@/modules/areas/schemas/area.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const areasQuery = useAreasListQuery(page, pageSize)
const createMutation = useCreateAreaMutation()
const updateMutation = useUpdateAreaMutation()
const deleteMutation = useDeleteAreaMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Area | null>(null)
const selectedToDelete = ref<Area | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<AreaFormValues>({
  validationSchema: toTypedSchema(areaSchema),
  initialValues: { nombre: '' },
})

const [nombre] = defineField('nombre')

const columns: EntityTableColumn[] = [{ key: 'nombre', title: 'Nombre' }]

const queryError = computed(() => {
  if (!areasQuery.error.value) return undefined
  return normalizeHttpError(areasQuery.error.value).message
})

const filteredItems = computed(() => {
  const items = areasQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  if (!term) return items
  return items.filter((item) => item.nombre.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar área' : 'Nueva área'))

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function openCreate() {
  editingItem.value = null
  resetForm({ values: { nombre: '' } })
  dialogOpen.value = true
}

function openEdit(item: Area) {
  editingItem.value = item
  setValues({ nombre: item.nombre })
  dialogOpen.value = true
}

function openDelete(item: Area) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload: values })
      uiStore.mostrarMensaje('Área actualizada correctamente')
    } else {
      await createMutation.mutateAsync(values)
      uiStore.mostrarMensaje('Área creada correctamente')
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
    uiStore.mostrarMensaje('Área eliminada correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

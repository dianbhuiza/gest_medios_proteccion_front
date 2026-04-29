<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Cargos</h2>

    <EntityTable
      :columns="columns"
      :items="filteredItems"
      :loading="cargosQuery.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="cargosQuery.data.value?.meta.total ?? 0"
      :total-pages="cargosQuery.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nuevo cargo</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit(item as unknown as Cargo)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item as unknown as Cargo)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <EntityDialog v-model="dialogOpen" :title="dialogTitle" :loading="isSaving" @save="onSave">
      <CargoFormFields v-model:nombre="nombre" :error="errors.nombre" />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar cargo"
      message="¿Seguro que deseas eliminar este cargo?"
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
import { type Cargo } from '@/modules/cargos/api/cargos.service'
import CargoFormFields from '@/modules/cargos/components/CargoFormFields.vue'
import {
  useCreateCargoMutation,
  useDeleteCargoMutation,
  useUpdateCargoMutation,
} from '@/modules/cargos/mutations/useCargosMutations'
import { useCargosListQuery } from '@/modules/cargos/queries/useCargosQueries'
import { cargoSchema, type CargoFormValues } from '@/modules/cargos/schemas/cargo.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const cargosQuery = useCargosListQuery(page, pageSize)
const createMutation = useCreateCargoMutation()
const updateMutation = useUpdateCargoMutation()
const deleteMutation = useDeleteCargoMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Cargo | null>(null)
const selectedToDelete = ref<Cargo | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<CargoFormValues>({
  validationSchema: toTypedSchema(cargoSchema),
  initialValues: { nombre: '' },
})

const [nombre] = defineField('nombre')

const columns: EntityTableColumn[] = [{ key: 'nombre', title: 'Nombre' }]

const queryError = computed(() => {
  if (!cargosQuery.error.value) return undefined
  return normalizeHttpError(cargosQuery.error.value).message
})

const filteredItems = computed(() => {
  const items = cargosQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  if (!term) return items
  return items.filter((item) => item.nombre.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar cargo' : 'Nuevo cargo'))

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function openCreate() {
  editingItem.value = null
  resetForm({ values: { nombre: '' } })
  dialogOpen.value = true
}

function openEdit(item: Cargo) {
  editingItem.value = item
  setValues({ nombre: item.nombre })
  dialogOpen.value = true
}

function openDelete(item: Cargo) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload: values })
      uiStore.mostrarMensaje('Cargo actualizado correctamente')
    } else {
      await createMutation.mutateAsync(values)
      uiStore.mostrarMensaje('Cargo creado correctamente')
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
    uiStore.mostrarMensaje('Cargo eliminado correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Tallas</h2>

    <EntityTable
      :columns="columns"
      :items="filteredItems"
      :loading="tallasQuery.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="tallasQuery.data.value?.meta.total ?? 0"
      :total-pages="tallasQuery.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nueva talla</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit(item as unknown as Talla)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item as unknown as Talla)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <EntityDialog v-model="dialogOpen" :title="dialogTitle" :loading="isSaving" @save="onSave">
      <TallaFormFields
        v-model:valor="valor"
        v-model:tipo="tipo"
        v-model:orden="orden"
        :errors="errors"
      />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar talla"
      message="¿Seguro que deseas eliminar esta talla?"
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
import TallaFormFields from '@/modules/tallas/components/TallaFormFields.vue'
import { type Talla } from '@/modules/tallas/api/tallas.service'
import {
  useCreateTallaMutation,
  useDeleteTallaMutation,
  useUpdateTallaMutation,
} from '@/modules/tallas/mutations/useTallasMutations'
import { useTallasListQuery } from '@/modules/tallas/queries/useTallasQueries'
import { tallaSchema, type TallaFormValues } from '@/modules/tallas/schemas/talla.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const tallasQuery = useTallasListQuery(page, pageSize)
const createMutation = useCreateTallaMutation()
const updateMutation = useUpdateTallaMutation()
const deleteMutation = useDeleteTallaMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Talla | null>(null)
const selectedToDelete = ref<Talla | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<TallaFormValues>({
  validationSchema: toTypedSchema(tallaSchema),
  initialValues: { valor: '', tipo: 'overol', orden: 0 },
})

const [valor] = defineField('valor')
const [tipo] = defineField('tipo')
const [orden] = defineField('orden')

const columns: EntityTableColumn[] = [
  { key: 'valor', title: 'Valor' },
  { key: 'tipo', title: 'Tipo' },
  { key: 'orden', title: 'Orden' },
]

const queryError = computed(() => {
  if (!tallasQuery.error.value) return undefined
  return normalizeHttpError(tallasQuery.error.value).message
})

const filteredItems = computed(() => {
  const items = tallasQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  if (!term) return items
  return items.filter((item) => `${item.valor} ${item.tipo}`.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar talla' : 'Nueva talla'))

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function openCreate() {
  editingItem.value = null
  resetForm({ values: { valor: '', tipo: 'overol', orden: 0 } })
  dialogOpen.value = true
}

function openEdit(item: Talla) {
  editingItem.value = item
  setValues({ valor: item.valor, tipo: item.tipo, orden: item.orden })
  dialogOpen.value = true
}

function openDelete(item: Talla) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload: values })
      uiStore.mostrarMensaje('Talla actualizada correctamente')
    } else {
      await createMutation.mutateAsync(values)
      uiStore.mostrarMensaje('Talla creada correctamente')
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
    uiStore.mostrarMensaje('Talla eliminada correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

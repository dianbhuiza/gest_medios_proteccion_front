<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">EPP</h2>

    <EntityTable
      :columns="columns"
      :items="filteredItems"
      :loading="mppsQuery.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="mppsQuery.data.value?.meta.total ?? 0"
      :total-pages="mppsQuery.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nuevo EPP</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" @click="selectMpp(item as unknown as Mpp)">Stock</v-btn>
        <v-btn size="small" variant="text" @click="openEdit(item as unknown as Mpp)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item as unknown as Mpp)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <MppStockManager
      :mpp-id="selectedMpp?.id ?? null"
      :stocks="stocksQuery.data.value?.results ?? []"
      :tallas="tallasQuery.data.value?.results ?? []"
      @set-stock="onSetStock"
      @ingreso="onIngresoStock"
      @retiro="onRetiroStock"
      @delete-stock="onDeleteStock"
    />

    <EntityDialog v-model="dialogOpen" :title="dialogTitle" :loading="isSaving" @save="onSave">
      <MppFormFields v-model:nombre="nombre" v-model:tipo-talla="tipo_talla" :errors="errors" />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar EPP"
      message="¿Seguro que deseas eliminar este EPP?"
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
import type { Mpp, MppStock } from '@/modules/mpps/api/mpps.service'
import MppFormFields from '@/modules/mpps/components/MppFormFields.vue'
import MppStockManager from '@/modules/mpps/components/MppStockManager.vue'
import {
  useCreateMppMutation,
  useDeleteMppMutation,
  useIngresoMppStockMutation,
  useRemoveMppStockMutation,
  useRetiroMppStockMutation,
  useSetMppStockMutation,
  useUpdateMppMutation,
} from '@/modules/mpps/mutations/useMppsMutations'
import { useMppStocksQuery, useMppsListQuery, useTallasForMppQuery } from '@/modules/mpps/queries/useMppsQueries'
import { mppSchema, type MppFormValues } from '@/modules/mpps/schemas/mpp.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const stockPage = ref(1)
const stockPageSize = ref(20)

const mppsQuery = useMppsListQuery(page, pageSize)
const tallasQuery = useTallasForMppQuery()

const selectedMpp = ref<Mpp | null>(null)
const stocksQuery = useMppStocksQuery(
  computed(() => selectedMpp.value?.id ?? null),
  stockPage,
  stockPageSize,
)

const createMutation = useCreateMppMutation()
const updateMutation = useUpdateMppMutation()
const deleteMutation = useDeleteMppMutation()
const setStockMutation = useSetMppStockMutation()
const deleteStockMutation = useRemoveMppStockMutation()
const ingresoMutation = useIngresoMppStockMutation()
const retiroMutation = useRetiroMppStockMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Mpp | null>(null)
const selectedToDelete = ref<Mpp | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<MppFormValues>({
  validationSchema: toTypedSchema(mppSchema),
  initialValues: { nombre: '', tipo_talla: 'overol' },
})

const [nombre] = defineField('nombre')
const [tipo_talla] = defineField('tipo_talla')

const columns: EntityTableColumn[] = [
  { key: 'nombre', title: 'Nombre' },
  { key: 'tipo_talla', title: 'Tipo talla' },
]

const queryError = computed(() => {
  if (!mppsQuery.error.value) return undefined
  return normalizeHttpError(mppsQuery.error.value).message
})

const filteredItems = computed(() => {
  const items = mppsQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  if (!term) return items
  return items.filter((item) => item.nombre.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar EPP' : 'Nuevo EPP'))

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function selectMpp(item: Mpp) {
  selectedMpp.value = item
  stockPage.value = 1
}

function openCreate() {
  editingItem.value = null
  resetForm({ values: { nombre: '', tipo_talla: 'overol' } })
  dialogOpen.value = true
}

function openEdit(item: Mpp) {
  editingItem.value = item
  setValues({ nombre: item.nombre, tipo_talla: item.tipo_talla })
  dialogOpen.value = true
}

function openDelete(item: Mpp) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload: values })
      uiStore.mostrarMensaje('EPP actualizado correctamente')
    } else {
      await createMutation.mutateAsync(values)
      uiStore.mostrarMensaje('EPP creado correctamente')
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
    uiStore.mostrarMensaje('EPP eliminado correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function onSetStock(payload: { tallaId: number; cantidad: number }) {
  if (!selectedMpp.value) return

  try {
    await setStockMutation.mutateAsync({
      mppId: selectedMpp.value.id,
      tallaId: payload.tallaId,
      cantidad: payload.cantidad,
    })
    uiStore.mostrarMensaje('Stock actualizado correctamente')
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function onIngresoStock(payload: { tallaId: number; cantidad: number }) {
  if (!selectedMpp.value) return

  try {
    await ingresoMutation.mutateAsync({
      mppId: selectedMpp.value.id,
      payload: { stocks: [{ talla_id: payload.tallaId, cantidad: payload.cantidad }] },
    })
    uiStore.mostrarMensaje('Ingreso de stock aplicado')
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function onRetiroStock(payload: { tallaId: number; cantidad: number }) {
  if (!selectedMpp.value) return

  try {
    await retiroMutation.mutateAsync({
      mppId: selectedMpp.value.id,
      payload: { stocks: [{ talla_id: payload.tallaId, cantidad: payload.cantidad }] },
    })
    uiStore.mostrarMensaje('Retiro de stock aplicado')
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function onDeleteStock(stock: MppStock) {
  try {
    await deleteStockMutation.mutateAsync({ mppId: stock.mpp_id, tallaId: stock.talla_id })
    uiStore.mostrarMensaje('Stock eliminado correctamente')
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

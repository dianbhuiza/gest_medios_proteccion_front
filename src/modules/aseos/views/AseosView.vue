<template>
  <v-container fluid>
    <h2 class="text-h5 mb-4">Insumos de Aseo</h2>

    <EntityTable
      :columns="columns"
      :items="filteredItems"
      :loading="aseosQuery.isLoading.value"
      :error="queryError"
      :search="search"
      :page="page"
      :page-size="pageSize"
      :total="aseosQuery.data.value?.meta.total ?? 0"
      :total-pages="aseosQuery.data.value?.meta.totalPages ?? 1"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:page-size="onPageSizeChange"
    >
      <template #toolbar>
        <v-btn color="primary" @click="openCreate">Nuevo insumo</v-btn>
      </template>

      <template #actions="{ item }">
        <v-btn size="small" variant="text" color="success" @click="openAjuste(item as unknown as Aseo, 'ingreso')"
          >Ingreso</v-btn
        >
        <v-btn size="small" variant="text" color="warning" @click="openAjuste(item as unknown as Aseo, 'retiro')"
          >Retiro</v-btn
        >
        <v-btn size="small" variant="text" @click="openEdit(item as unknown as Aseo)">Editar</v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item as unknown as Aseo)">Eliminar</v-btn>
      </template>
    </EntityTable>

    <EntityDialog v-model="dialogOpen" :title="dialogTitle" :loading="isSaving" @save="onSave">
      <AseoFormFields v-model:nombre="nombre" v-model:cantidad="cantidad" :errors="errors" />
    </EntityDialog>

    <EntityDialog
      v-model="ajusteDialogOpen"
      :title="ajusteTitle"
      :loading="ingresoMutation.isPending.value || retiroMutation.isPending.value"
      @save="onSaveAjuste"
    >
      <v-text-field
        v-model.number="ajusteCantidad"
        label="Cantidad"
        type="number"
        min="1"
        variant="outlined"
      />
    </EntityDialog>

    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="Eliminar insumo"
      message="¿Seguro que deseas eliminar este insumo de aseo?"
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
import type { Aseo } from '@/modules/aseos/api/aseos.service'
import AseoFormFields from '@/modules/aseos/components/AseoFormFields.vue'
import {
  useCreateAseoMutation,
  useDeleteAseoMutation,
  useIngresoAseoMutation,
  useRetiroAseoMutation,
  useUpdateAseoMutation,
} from '@/modules/aseos/mutations/useAseosMutations'
import { useAseosListQuery } from '@/modules/aseos/queries/useAseosQueries'
import { aseoSchema, type AseoFormValues } from '@/modules/aseos/schemas/aseo.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import EntityTable, { type EntityTableColumn } from '@/shared/components/EntityTable.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const aseosQuery = useAseosListQuery(page, pageSize)
const createMutation = useCreateAseoMutation()
const updateMutation = useUpdateAseoMutation()
const deleteMutation = useDeleteAseoMutation()
const ingresoMutation = useIngresoAseoMutation()
const retiroMutation = useRetiroAseoMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const ajusteDialogOpen = ref(false)
const ajusteCantidad = ref(1)
const ajusteTipo = ref<'ingreso' | 'retiro'>('ingreso')

const editingItem = ref<Aseo | null>(null)
const selectedToDelete = ref<Aseo | null>(null)
const selectedAjusteItem = ref<Aseo | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<AseoFormValues>({
  validationSchema: toTypedSchema(aseoSchema),
  initialValues: { nombre: '', cantidad: 0 },
})

const [nombre] = defineField('nombre')
const [cantidad] = defineField('cantidad')

const columns: EntityTableColumn[] = [
  { key: 'nombre', title: 'Nombre' },
  { key: 'cantidad', title: 'Cantidad' },
]

const queryError = computed(() => {
  if (!aseosQuery.error.value) return undefined
  return normalizeHttpError(aseosQuery.error.value).message
})

const filteredItems = computed(() => {
  const items = aseosQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  if (!term) return items
  return items.filter((item) => item.nombre.toLowerCase().includes(term))
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar insumo' : 'Nuevo insumo'))
const ajusteTitle = computed(() =>
  ajusteTipo.value === 'ingreso' ? 'Registrar ingreso de cantidad' : 'Registrar retiro de cantidad',
)

function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function openCreate() {
  editingItem.value = null
  resetForm({ values: { nombre: '', cantidad: 0 } })
  dialogOpen.value = true
}

function openEdit(item: Aseo) {
  editingItem.value = item
  setValues({ nombre: item.nombre, cantidad: item.cantidad })
  dialogOpen.value = true
}

function openDelete(item: Aseo) {
  selectedToDelete.value = item
  deleteDialogOpen.value = true
}

function openAjuste(item: Aseo, tipo: 'ingreso' | 'retiro') {
  selectedAjusteItem.value = item
  ajusteTipo.value = tipo
  ajusteCantidad.value = 1
  ajusteDialogOpen.value = true
}

const onSave = handleSubmit(async (values) => {
  try {
    if (editingItem.value) {
      await updateMutation.mutateAsync({ id: editingItem.value.id, payload: values })
      uiStore.mostrarMensaje('Insumo actualizado correctamente')
    } else {
      await createMutation.mutateAsync(values)
      uiStore.mostrarMensaje('Insumo creado correctamente')
    }

    dialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
})

async function onSaveAjuste() {
  if (!selectedAjusteItem.value || ajusteCantidad.value <= 0) return

  try {
    if (ajusteTipo.value === 'ingreso') {
      await ingresoMutation.mutateAsync({ id: selectedAjusteItem.value.id, cantidad: ajusteCantidad.value })
      uiStore.mostrarMensaje('Ingreso aplicado correctamente')
    } else {
      await retiroMutation.mutateAsync({ id: selectedAjusteItem.value.id, cantidad: ajusteCantidad.value })
      uiStore.mostrarMensaje('Retiro aplicado correctamente')
    }

    ajusteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function confirmDelete() {
  if (!selectedToDelete.value) return

  try {
    await deleteMutation.mutateAsync(selectedToDelete.value.id)
    uiStore.mostrarMensaje('Insumo eliminado correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

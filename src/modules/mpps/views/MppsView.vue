<template>
  <div class="mpps-page">
    <!-- ── Left Panel: EPP list ─────────────────────────────── -->
    <v-card class="mpps-panel" rounded="lg" elevation="1">
      <div class="panel-header">
        <span class="text-h6 font-weight-medium">EPP</span>
        <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="openCreate">
          Nuevo EPP
        </v-btn>
      </div>

      <div class="px-4 pt-3 pb-2">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar EPP"
          density="compact"
          variant="outlined"
          hide-details
          clearable
        />
      </div>

      <v-progress-linear v-if="mppsQuery.isLoading.value" indeterminate color="primary" />

      <div class="panel-body">
        <v-alert v-if="queryError" type="error" variant="tonal" class="mx-4 mb-3">
          {{ queryError }}
        </v-alert>
        <v-alert
          v-else-if="!mppsQuery.isLoading.value && filteredItems.length === 0"
          type="info"
          variant="tonal"
          class="mx-4"
        >
          No hay EPP registrados.
        </v-alert>

        <v-table v-else density="comfortable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th style="width: 110px">Tipo talla</th>
              <th style="width: 80px"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="mpp-row"
              :class="{ 'mpp-row--selected': selectedMpp?.id === item.id }"
              @click="selectMpp(item)"
            >
              <td>{{ item.nombre }}</td>
              <td>
                <v-chip size="small" variant="tonal" color="secondary">{{ item.tipo_talla }}</v-chip>
              </td>
              <td @click.stop class="text-center">
                <v-menu location="bottom end" attach="body">
                  <template #activator="{ props: menuProps }">
                    <v-btn size="small" variant="text" icon="mdi-dots-vertical" color="on-surface" v-bind="menuProps" />
                  </template>
                  <v-list density="compact" nav min-width="150">
                    <v-list-item prepend-icon="mdi-pencil" title="Editar" @click="openEdit(item)" />
                    <v-list-item prepend-icon="mdi-delete" title="Eliminar" class="text-error" @click="openDelete(item)" />
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div class="panel-footer">
        <v-row align="center" no-gutters>
          <v-col cols="5">
            <v-select
              :model-value="pageSize"
              :items="[10, 20, 50, 100]"
              label="Por página"
              density="compact"
              variant="outlined"
              hide-details
              @update:model-value="onPageSizeChange(Number($event))"
            />
          </v-col>
          <v-col cols="7" class="d-flex justify-end">
            <v-pagination
              :model-value="page"
              :length="Math.max(mppsQuery.data.value?.meta.totalPages ?? 1, 1)"
              density="comfortable"
              size="small"
              @update:model-value="page = Number($event)"
            />
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- ── Right Panel: Stock por talla ────────────────────────── -->
    <v-card class="stock-panel" rounded="lg" elevation="1">
      <div v-if="!selectedMpp" class="panel-empty">
        <v-icon size="56" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
        <p class="text-body-2 text-medium-emphasis mt-3 text-center">
          Selecciona un EPP de la tabla<br>para gestionar su stock por talla
        </p>
      </div>

      <template v-else>
        <div class="panel-header">
          <div>
            <p class="text-caption text-medium-emphasis mb-0" style="line-height:1">Stock de</p>
            <div class="d-flex align-center ga-2">
              <span class="text-h6 font-weight-medium">{{ selectedMpp.nombre }}</span>
              <v-chip size="small" variant="tonal" color="secondary">{{ selectedMpp.tipo_talla }}</v-chip>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 stock-form">
          <v-row dense align="center">
            <v-col v-if="selectedMpp.tipo_talla !== 'sin_talla'" cols="12" sm="4">
              <v-select
                v-model="stockTallaId"
                :items="tallasFiltradas"
                item-title="valor"
                item-value="id"
                label="Talla"
                density="compact"
                variant="outlined"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" :sm="selectedMpp.tipo_talla !== 'sin_talla' ? 3 : 5">
              <v-text-field
                v-model.number="stockCantidad"
                type="number"
                min="0"
                label="Cantidad"
                density="compact"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" :sm="selectedMpp.tipo_talla !== 'sin_talla' ? 5 : 7" class="d-flex ga-2">
              <v-btn
                color="success"
                size="small"
                variant="tonal"
                prepend-icon="mdi-plus"
                :disabled="!canSubmitStock"
                :loading="ingresoMutation.isPending.value"
                @click="onIngresoStock"
              >
                Ingreso
              </v-btn>
              <v-btn
                color="warning"
                size="small"
                variant="tonal"
                prepend-icon="mdi-minus"
                :disabled="!canSubmitStock"
                :loading="retiroMutation.isPending.value"
                @click="onRetiroStock"
              >
                Retiro
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                variant="tonal"
                prepend-icon="mdi-pencil-outline"
                :disabled="!canSubmitStock || selectedMpp.tipo_talla === 'sin_talla'"
                :loading="setStockMutation.isPending.value"
                @click="onSetStock"
              >
                Fijar
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <v-divider />

        <div class="panel-body">
          <v-progress-linear v-if="stocksQuery.isLoading.value" indeterminate color="primary" />
          <v-alert
            v-if="currentStocks.length === 0 && !stocksQuery.isLoading.value"
            type="info"
            variant="tonal"
            class="mx-4 mt-3"
          >
            Sin stock registrado para este EPP.
          </v-alert>

          <v-table v-else density="comfortable">
            <thead>
              <tr>
                <th>Talla</th>
                <th class="text-center" style="width: 100px">Cantidad</th>
                <th style="width: 60px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in currentStocks" :key="`${stock.mpp_id}-${stock.talla_id}`">
                <td>{{ getTallaLabel(stock.talla_id) }}</td>
                <td class="text-center">
                  <v-chip size="small" :color="stock.cantidad > 0 ? 'success' : 'error'" variant="tonal">
                    {{ stock.cantidad }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-menu location="bottom end" attach="body">
                    <template #activator="{ props: menuProps }">
                      <v-btn size="small" variant="text" icon="mdi-dots-vertical" color="on-surface" v-bind="menuProps" />
                    </template>
                    <v-list density="compact" nav min-width="150">
                      <v-list-item prepend-icon="mdi-delete" title="Eliminar stock" class="text-error" @click="openDeleteStock(stock)" />
                    </v-list>
                  </v-menu>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </template>
    </v-card>
  </div>

  <!-- ── Dialogs ───────────────────────────────────────────────── -->

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

  <ConfirmDialog
    v-model="deleteStockDialogOpen"
    title="Eliminar stock"
    message="¿Seguro que deseas eliminar el stock de esta talla?"
    :loading="deleteStockMutation.isPending.value"
    @confirm="confirmDeleteStock"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { normalizeHttpError } from '@/core/http/error'
import type { Mpp, MppStock } from '@/modules/mpps/api/mpps.service'
import MppFormFields from '@/modules/mpps/components/MppFormFields.vue'
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
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const stockPage = ref(1)
const stockPageSize = ref(100)

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

// ── EPP form ────────────────────────────────────────────
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

// ── Stock form ───────────────────────────────────────────
const stockTallaId = ref<number | null>(null)
const stockCantidad = ref(0)
const deleteStockDialogOpen = ref(false)
const stockToDelete = ref<MppStock | null>(null)

// ── Computed ───────────────────────────────────────────────
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

const currentStocks = computed(() => stocksQuery.data.value?.results ?? [])

const tallasFiltradas = computed(() => {
  const tallas = tallasQuery.data.value?.results ?? []
  if (!selectedMpp.value || selectedMpp.value.tipo_talla === 'sin_talla') return tallas
  return tallas.filter((t) => t.tipo === selectedMpp.value!.tipo_talla)
})

const canSubmitStock = computed(() => {
  const sinTalla = selectedMpp.value?.tipo_talla === 'sin_talla'
  const tallaOk = sinTalla || Boolean(stockTallaId.value)
  return tallaOk && stockCantidad.value > 0
})

const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar EPP' : 'Nuevo EPP'))

// ── Helpers ──────────────────────────────────────────────
function getTallaLabel(id: number) {
  return tallasQuery.data.value?.results.find((t) => t.id === id)?.valor ?? `#${id}`
}

// ── EPP actions ───────────────────────────────────────────
function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function selectMpp(item: Mpp) {
  selectedMpp.value = item
  stockTallaId.value = null
  stockCantidad.value = 0
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
    if (selectedMpp.value?.id === selectedToDelete.value.id) selectedMpp.value = null
    await deleteMutation.mutateAsync(selectedToDelete.value.id)
    uiStore.mostrarMensaje('EPP eliminado correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

// ── Stock actions ──────────────────────────────────────────
function resolvedTallaId(): number | null {
  return selectedMpp.value?.tipo_talla === 'sin_talla' ? null : stockTallaId.value
}

async function onIngresoStock() {
  if (!selectedMpp.value) return
  try {
    await ingresoMutation.mutateAsync({
      mppId: selectedMpp.value.id,
      payload: { stocks: [{ talla_id: resolvedTallaId() as number, cantidad: stockCantidad.value }] },
    })
    uiStore.mostrarMensaje('Ingreso de stock aplicado')
    stockCantidad.value = 0
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function onRetiroStock() {
  if (!selectedMpp.value) return
  try {
    await retiroMutation.mutateAsync({
      mppId: selectedMpp.value.id,
      payload: { stocks: [{ talla_id: resolvedTallaId() as number, cantidad: stockCantidad.value }] },
    })
    uiStore.mostrarMensaje('Retiro de stock aplicado')
    stockCantidad.value = 0
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

async function onSetStock() {
  if (!selectedMpp.value || !stockTallaId.value) return
  try {
    await setStockMutation.mutateAsync({
      mppId: selectedMpp.value.id,
      tallaId: stockTallaId.value,
      cantidad: stockCantidad.value,
    })
    uiStore.mostrarMensaje('Stock actualizado correctamente')
    stockCantidad.value = 0
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

function openDeleteStock(stock: MppStock) {
  stockToDelete.value = stock
  deleteStockDialogOpen.value = true
}

async function confirmDeleteStock() {
  if (!stockToDelete.value) return
  try {
    await deleteStockMutation.mutateAsync({
      mppId: stockToDelete.value.mpp_id,
      tallaId: stockToDelete.value.talla_id,
    })
    uiStore.mostrarMensaje('Stock eliminado correctamente')
    deleteStockDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

<style scoped>
/* ── Page layout ─────────────────────────────────────── */
.mpps-page {
  display: flex;
  gap: 16px;
  height: calc(100vh - 160px);
  overflow: hidden;
}

/* ── Panels ──────────────────────────────────────────── */
.mpps-panel,
.stock-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mpps-panel {
  width: 45%;
  min-width: 320px;
}

.stock-panel {
  flex: 1;
}

/* ── Shared sections ─────────────────────────────────── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  flex-shrink: 0;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.panel-footer {
  padding: 10px 12px;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  flex-shrink: 0;
}

.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
}

/* ── Stock form ───────────────────────────────────────── */
.stock-form {
  flex-shrink: 0;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}

/* ── EPP row states ───────────────────────────────────── */
.mpp-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.mpp-row:hover:not(.mpp-row--selected) td {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.mpp-row--selected td {
  background-color: rgba(var(--v-theme-primary), 0.14) !important;
}
</style>

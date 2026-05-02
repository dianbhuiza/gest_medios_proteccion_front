<template>
  <div class="areas-page">
    <!-- ── Left Panel: Áreas ─────────────────────────────────── -->
    <v-card class="areas-panel" rounded="lg" elevation="1">
      <div class="panel-header">
        <span class="text-h6 font-weight-medium">Áreas</span>
        <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="openCreate">
          Nueva área
        </v-btn>
      </div>

      <div class="px-4 pt-3 pb-2">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar área"
          density="compact"
          variant="outlined"
          hide-details
          clearable
        />
      </div>

      <v-progress-linear v-if="areasQuery.isLoading.value" indeterminate color="primary" />

      <div class="panel-body">
        <v-alert v-if="queryError" type="error" variant="tonal" class="mx-4 mb-3">
          {{ queryError }}
        </v-alert>
        <v-alert
          v-else-if="!areasQuery.isLoading.value && filteredItems.length === 0"
          type="info"
          variant="tonal"
          class="mx-4"
        >
          No hay áreas registradas.
        </v-alert>

        <v-table v-else density="comfortable" class="areas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th class="text-center" style="width: 90px">Sub-áreas</th>
              <th style="width: 48px"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="area-row"
              :class="{ 'area-row--selected': selectedArea?.id === item.id }"
              @click="selectArea(item)"
            >
              <td>{{ item.nombre }}</td>
              <td class="text-center">
                <v-chip
                  size="small"
                  :color="item.sub_areas_count > 0 ? 'primary' : 'default'"
                  variant="tonal"
                >
                  {{ item.sub_areas_count }}
                </v-chip>
              </td>
              <td @click.stop class="text-center">
                <v-menu location="bottom end" attach="body">
                  <template #activator="{ props: menuProps }">
                    <v-btn size="small" variant="text" icon="mdi-dots-vertical" color="on-surface" v-bind="menuProps" />
                  </template>
                  <v-list density="compact" nav min-width="150">
                    <v-list-item
                      prepend-icon="mdi-pencil"
                      title="Editar"
                      @click="openEdit(item)"
                    />
                    <v-list-item
                      prepend-icon="mdi-delete"
                      title="Eliminar"
                      class="text-error"
                      @click="openDelete(item)"
                    />
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
              :length="Math.max(areasQuery.data.value?.meta.totalPages ?? 1, 1)"
              density="comfortable"
              size="small"
              @update:model-value="page = Number($event)"
            />
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- ── Right Panel: Sub-áreas ─────────────────────────────── -->
    <v-card class="subareas-panel" rounded="lg" elevation="1">
      <div v-if="!selectedArea" class="subareas-empty">
        <v-icon size="56" color="grey-lighten-1">mdi-layers-outline</v-icon>
        <p class="text-body-2 text-medium-emphasis mt-3 text-center">
          Selecciona un área de la tabla<br>para ver y gestionar sus sub-áreas
        </p>
      </div>

      <template v-else>
        <div class="panel-header">
          <div>
            <p class="text-caption text-medium-emphasis mb-0" style="line-height:1">Sub-áreas de</p>
            <span class="text-h6 font-weight-medium">{{ selectedArea.nombre }}</span>
          </div>
          <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="openCreateSubArea">
            Nueva sub-área
          </v-btn>
        </div>

        <div class="panel-body">
          <v-alert v-if="subAreas.length === 0" type="info" variant="tonal" class="mx-4">
            Esta área no tiene sub-áreas todavía.
          </v-alert>

          <v-table v-else density="comfortable">
            <thead>
              <tr>
                <th>Nombre</th>
                <th style="width: 48px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sa in subAreas" :key="sa.id">
                <td>{{ sa.nombre }}</td>
                <td class="text-center">
                  <v-menu location="bottom end" attach="body">
                    <template #activator="{ props: menuProps }">
                      <v-btn size="small" variant="text" icon="mdi-dots-vertical" color="on-surface" v-bind="menuProps" />
                    </template>
                    <v-list density="compact" nav min-width="150">
                      <v-list-item
                        prepend-icon="mdi-pencil"
                        title="Editar"
                        @click="openEditSubArea(sa)"
                      />
                      <v-list-item
                        prepend-icon="mdi-delete"
                        title="Eliminar"
                        class="text-error"
                        @click="openDeleteSubArea(sa)"
                      />
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
    <AreaFormFields v-model:nombre="nombre" :error="errors.nombre" />
  </EntityDialog>

  <ConfirmDialog
    v-model="deleteDialogOpen"
    title="Eliminar área"
    message="¿Seguro que deseas eliminar esta área?"
    :loading="deleteMutation.isPending.value"
    @confirm="confirmDelete"
  />

  <EntityDialog
    v-model="subAreaFormOpen"
    :title="subAreaDialogTitle"
    :loading="isSubAreaSaving"
    @save="onSubAreaSave"
  >
    <AreaFormFields v-model:nombre="subAreaNombre" :error="subAreaErrors.nombre" />
  </EntityDialog>

  <ConfirmDialog
    v-model="deleteSubAreaDialogOpen"
    title="Eliminar sub-área"
    message="¿Seguro que deseas eliminar esta sub-área?"
    :loading="deleteSubAreaMutation.isPending.value"
    @confirm="confirmDeleteSubArea"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { normalizeHttpError } from '@/core/http/error'
import AreaFormFields from '@/modules/areas/components/AreaFormFields.vue'
import { type Area, type SubArea } from '@/modules/areas/api/areas.service'
import {
  useCreateAreaMutation,
  useDeleteAreaMutation,
  useUpdateAreaMutation,
  useCreateSubAreaMutation,
  useUpdateSubAreaMutation,
  useDeleteSubAreaMutation,
} from '@/modules/areas/mutations/useAreasMutations'
import { useAreasListQuery } from '@/modules/areas/queries/useAreasQueries'
import { areaSchema, type AreaFormValues } from '@/modules/areas/schemas/area.schema'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import EntityDialog from '@/shared/components/EntityDialog.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const page = ref(1)
const pageSize = ref(20)
const search = ref('')

const areasQuery = useAreasListQuery(page, pageSize)
const createMutation = useCreateAreaMutation()
const updateMutation = useUpdateAreaMutation()
const deleteMutation = useDeleteAreaMutation()
const createSubAreaMutation = useCreateSubAreaMutation()
const updateSubAreaMutation = useUpdateSubAreaMutation()
const deleteSubAreaMutation = useDeleteSubAreaMutation()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingItem = ref<Area | null>(null)
const selectedToDelete = ref<Area | null>(null)

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm<AreaFormValues>({
  validationSchema: toTypedSchema(areaSchema),
  initialValues: { nombre: '' },
})

const [nombre] = defineField('nombre')

// ── Selected area & sub-areas ─────────────────────────────────
const selectedArea = ref<Area | null>(null)

const subAreas = computed<SubArea[]>(() => {
  if (!selectedArea.value) return []
  const found = areasQuery.data.value?.results.find((a) => a.id === selectedArea.value!.id)
  return found?.sub_areas ?? []
})

const subAreaFormOpen = ref(false)
const deleteSubAreaDialogOpen = ref(false)
const editingSubArea = ref<SubArea | null>(null)
const selectedSubAreaToDelete = ref<SubArea | null>(null)

const {
  defineField: defineSubAreaField,
  errors: subAreaErrors,
  handleSubmit: handleSubAreaSubmit,
  resetForm: resetSubAreaForm,
  setValues: setSubAreaValues,
} = useForm<AreaFormValues>({
  validationSchema: toTypedSchema(areaSchema),
  initialValues: { nombre: '' },
})

const [subAreaNombre] = defineSubAreaField('nombre')

const queryError = computed(() => {
  if (!areasQuery.error.value) return undefined
  return normalizeHttpError(areasQuery.error.value).message
})

const filteredItems = computed(() => {
  const items = areasQuery.data.value?.results ?? []
  const term = search.value.trim().toLowerCase()

  const mapped = items.map((item) => ({
    ...item,
    sub_areas_count: item.sub_areas?.length ?? 0,
  }))

  if (!term) return mapped
  return mapped.filter((item) => item.nombre.toLowerCase().includes(term))
})

// ── Computed ──────────────────────────────────────────────────
const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)
const dialogTitle = computed(() => (editingItem.value ? 'Editar área' : 'Nueva área'))
const isSubAreaSaving = computed(
  () => createSubAreaMutation.isPending.value || updateSubAreaMutation.isPending.value,
)
const subAreaDialogTitle = computed(() => (editingSubArea.value ? 'Editar sub-área' : 'Nueva sub-área'))

// ── Área actions ──────────────────────────────────────────────
function onPageSizeChange(value: number) {
  pageSize.value = value
  page.value = 1
}

function selectArea(item: (typeof filteredItems.value)[number]) {
  selectedArea.value = areasQuery.data.value?.results.find((a) => a.id === item.id) ?? null
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
    if (selectedArea.value?.id === selectedToDelete.value.id) selectedArea.value = null
    await deleteMutation.mutateAsync(selectedToDelete.value.id)
    uiStore.mostrarMensaje('Área eliminada correctamente')
    deleteDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}

// ── Sub-área actions ──────────────────────────────────────────
function openCreateSubArea() {
  editingSubArea.value = null
  resetSubAreaForm({ values: { nombre: '' } })
  subAreaFormOpen.value = true
}

function openEditSubArea(sa: SubArea) {
  editingSubArea.value = sa
  setSubAreaValues({ nombre: sa.nombre })
  subAreaFormOpen.value = true
}

function openDeleteSubArea(sa: SubArea) {
  selectedSubAreaToDelete.value = sa
  deleteSubAreaDialogOpen.value = true
}

const onSubAreaSave = handleSubAreaSubmit(async (values) => {
  if (!selectedArea.value) return
  try {
    if (editingSubArea.value) {
      await updateSubAreaMutation.mutateAsync({
        areaId: selectedArea.value.id,
        subAreaId: editingSubArea.value.id,
        payload: values,
      })
      uiStore.mostrarMensaje('Sub-área actualizada correctamente')
    } else {
      await createSubAreaMutation.mutateAsync({ areaId: selectedArea.value.id, payload: values })
      uiStore.mostrarMensaje('Sub-área creada correctamente')
    }
    subAreaFormOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
})

async function confirmDeleteSubArea() {
  if (!selectedArea.value || !selectedSubAreaToDelete.value) return
  try {
    await deleteSubAreaMutation.mutateAsync({
      areaId: selectedArea.value.id,
      subAreaId: selectedSubAreaToDelete.value.id,
    })
    uiStore.mostrarMensaje('Sub-área eliminada correctamente')
    deleteSubAreaDialogOpen.value = false
  } catch (error) {
    uiStore.mostrarMensaje(normalizeHttpError(error).message, 'error')
  }
}
</script>

<style scoped>
/* ── Page layout ───────────────────────────────────────────── */
.areas-page {
  display: flex;
  gap: 16px;
  height: calc(100vh - 160px);
  overflow: hidden;
}

/* ── Panel base ────────────────────────────────────────────── */
.areas-panel,
.subareas-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.areas-panel {
  width: 45%;
  min-width: 320px;
}

.subareas-panel {
  flex: 1;
}

/* ── Panel sections ────────────────────────────────────────── */
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

/* ── Area row states ───────────────────────────────────────── */
.area-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.area-row:hover:not(.area-row--selected) td {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.area-row--selected td {
  background-color: rgba(var(--v-theme-primary), 0.14) !important;
}

/* ── Sub-areas empty state ─────────────────────────────────── */
.subareas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
}
</style>

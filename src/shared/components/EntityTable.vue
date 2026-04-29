<template>
  <v-card>
    <v-card-text>
      <v-row class="mb-3" align="center" no-gutters>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar"
            density="comfortable"
            variant="outlined"
            hide-details
            @update:model-value="emit('update:search', String($event ?? ''))"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end mt-3 mt-md-0">
          <slot name="toolbar" />
        </v-col>
      </v-row>

      <div class="text-caption text-medium-emphasis mb-2">
        Mostrando {{ items.length }} resultados de {{ total }}
      </div>

      <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-3" />

      <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>
      <v-alert v-else-if="!loading && items.length === 0" type="info" variant="tonal" class="mb-3"
        >No hay registros para mostrar</v-alert
      >

      <v-table density="comfortable">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
            <th v-if="$slots.actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td v-for="column in columns" :key="`${item.id}-${column.key}`">
              {{ (item as Record<string, unknown>)[column.key] }}
            </td>
            <td v-if="$slots.actions">
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-row class="mt-4" align="center">
        <v-col cols="12" md="4">
          <v-select
            :model-value="pageSize"
            :items="[10, 20, 50, 100]"
            label="Elementos por página"
            density="compact"
            variant="outlined"
            hide-details
            @update:model-value="emit('update:pageSize', Number($event))"
          />
        </v-col>
        <v-col cols="12" md="8" class="d-flex justify-end">
          <v-pagination
            :model-value="page"
            :length="Math.max(totalPages, 1)"
            density="comfortable"
            @update:model-value="emit('update:page', Number($event))"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
export interface EntityTableColumn {
  key: string
  title: string
}

defineProps<{
  columns: EntityTableColumn[]
  items: Array<{ id: number | string }>
  loading: boolean
  error?: string
  search: string
  page: number
  pageSize: number
  total: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
}>()
</script>

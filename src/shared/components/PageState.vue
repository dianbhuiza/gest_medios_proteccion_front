<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-3" />
    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>
    <v-alert v-else-if="empty" type="info" variant="tonal" class="mb-3">{{ emptyMessage }}</v-alert>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading: boolean
    error?: string
    empty?: boolean
    emptyMessage?: string
  }>(),
  {
    empty: false,
    emptyMessage: 'No hay datos para mostrar',
  },
)
</script>

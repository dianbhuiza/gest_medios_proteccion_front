<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="trabajadorId"
        :items="trabajadores"
        item-title="nombre"
        item-value="id"
        label="Trabajador"
        variant="outlined"
        :error-messages="errors.trabajador_id ? [errors.trabajador_id] : []"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="fecha" label="Fecha (opcional)" variant="outlined" />
    </v-col>
    <v-col cols="12">
      <v-textarea
        v-model="itemsJson"
        label="Items JSON"
        variant="outlined"
        rows="6"
        :hint="hint"
        persistent-hint
        :error-messages="errors.items_json ? [errors.items_json] : []"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  trabajadores: Array<{ id: number; nombre: string }>
  hint: string
  errors: Record<string, string | undefined>
}>()

const trabajadorId = defineModel<number>('trabajadorId', { required: true })
const fecha = defineModel<string>('fecha', { required: true })
const itemsJson = defineModel<string>('itemsJson', { required: true })
</script>

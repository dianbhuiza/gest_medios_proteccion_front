<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-text-field
        v-model="valor"
        label="Valor"
        variant="outlined"
        :error-messages="errors.valor ? [errors.valor] : []"
        required
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="tipo"
        label="Tipo"
        variant="outlined"
        :items="tipos"
        :error-messages="errors.tipo ? [errors.tipo] : []"
        required
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field
        v-model.number="orden"
        label="Orden"
        variant="outlined"
        type="number"
        :error-messages="errors.orden ? [errors.orden] : []"
        required
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const valor = defineModel<string>('valor', { required: true })
const tipo = defineModel<string>('tipo', { required: true })
const orden = defineModel<number>('orden', { required: true })

defineProps<{
  errors: {
    valor?: string
    tipo?: string
    orden?: string
  }
}>()

const tipos = ['overol', 'botas', 'guantes', 'casco', 'otro']
</script>

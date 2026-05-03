import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'refineria',
    themes: {
      refineria: {
        dark: false,
        colors: {
          background: '#F0F7FF',
          surface: '#FFFFFF',
          'surface-variant': '#F1F5F9',
          primary: '#2563EB',
          'primary-darken-1': '#1D4ED8',
          secondary: '#64748B',
          'secondary-darken-1': '#475569',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#22C55E',
          warning: '#F59E0B',
          'on-background': '#1E293B',
          'on-surface': '#334155',
          'on-primary': '#FFFFFF',
        },
        variables: {
          'border-color': '#E2E8F0',
          'border-opacity': 1,
          'high-emphasis-opacity': 0.92,
          'medium-emphasis-opacity': 0.65,
        },
      },
    },
  },
})

export default vuetify
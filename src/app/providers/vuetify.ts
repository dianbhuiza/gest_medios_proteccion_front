import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'refineria',
    themes: {
      refineria: {
        dark: true,
        colors: {
          background: '#0C0F18',
          surface: '#131720',
          'surface-variant': '#1C2232',
          primary: '#F59E0B',
          'primary-darken-1': '#D97706',
          secondary: '#64748B',
          'secondary-darken-1': '#475569',
          error: '#F87171',
          info: '#60A5FA',
          success: '#34D399',
          warning: '#FB923C',
          'on-background': '#E2E8F0',
          'on-surface': '#CBD5E1',
          'on-primary': '#0C0F18',
        },
        variables: {
          'border-color': '#1E2D40',
          'border-opacity': 1,
          'high-emphasis-opacity': 0.92,
          'medium-emphasis-opacity': 0.65,
        },
      },
    },
  },
})

export default vuetify
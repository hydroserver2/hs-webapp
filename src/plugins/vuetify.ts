import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify, ThemeDefinition } from 'vuetify'
import { VBtn } from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'

// Material theme Colors: https://vuetifyjs.com/en/styles/colors/
const theme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FAFAFA', // grey-lighten-5
    surface: '#FFFFFF', // white
    primary: '#2196F3', // blue
    secondary: '#4CAF50', // green
    default: '#757575', // grey-darken-1
    delete: '#F44336', // red
    error: '#F44336', // red
    info: '#03A9F4', // light-blue
    success: '#4CAF50', // green
    warning: '#FF9800', // orange
  },
}

const textFieldAttrs = {
  variant: 'outlined',
}

const btnAttrs = {
  color: 'primary',
  style: 'text-transform: none;', // Remove uppercase text
  rounded: false,
}

export default createVuetify({
  blueprint: md3,
  directives,
  aliases: {
    VBtnPrimary: VBtn,
    VBtnSecondary: VBtn,
    VBtnCancel: VBtn,
    VBtnDelete: VBtn,
    VBtnAdd: VBtn,
  },
  defaults: {
    global: {
      density: 'compact',
    },
    VToolbar: { density: 'default' },
    VDataTable: { density: 'default' },
    VTextField: textFieldAttrs,
    VAutocomplete: textFieldAttrs,
    VTextarea: textFieldAttrs,
    VCheckbox: textFieldAttrs,
    VCombobox: {
      variant: 'outlined',
    },
    VBtn: btnAttrs,
    VBtnPrimary: {
      ...btnAttrs,
      color: 'primary',
    },
    VBtnSecondary: {
      ...btnAttrs,
      color: 'secondary',
    },
    VBtnDelete: {
      ...btnAttrs,
      color: 'delete',
    },
    VBtnCancel: {
      ...btnAttrs,
      color: 'grey',
    },
    VBtnAdd: {
      ...btnAttrs,
      color: 'secondary',
      prependIcon: 'mdi-plus',
      rounded: true,
      variant: 'elevated',
    },
  },
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme,
    },
    variations: {
      colors: ['primary', 'secondary', 'surface'],
      lighten: 6,
      darken: 6,
    },
  },
})

export const required = [
  (value: string) => !!value || 'This field is required.',
]

export const requiredNumber = [
  (value: number | string) => {
    if (typeof value === 'number' && !isNaN(value)) return true
    if (
      typeof value === 'string' &&
      /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(value)
    )
      return true
    return 'This field requires a valid number.'
  },
]

export const minLength = (length: number) => [
  (value: string | number) =>
    (value && `${value}`.length >= length) ||
    `This field must be at least ${length} characters long.`,
]

export const maxLength = (max: number) => [
  (value: string | number) =>
    !value || `${value}`.length <= max || `Maximum ${max} characters allowed.`,
]

export const lessThan = (max: number, name?: string) => [
  (value: number) =>
    value == null ||
    value < max ||
    `Value must be less than ${name ? name : max}`,
]

export const greaterThan = (min: number, name?: string) => [
  (value: number) =>
    value == null ||
    value > min ||
    `Value must be greater than ${name ? name : min}`,
]

export const emailFormat = [
  (value: string) => /.+@.+\..+/.test(value) || 'Email must be valid.',
]

export const phoneNumber = [
  (value: string) => {
    if (!value) return true
    const numericValue = value.replace(/\D/g, '')
    if (numericValue.length == 10) {
      if (/^[\d\+\-\(\)\s]*$/.test(value)) {
        return true
      }
      return 'Phone number can only contain digits, plus sign, parentheses, hyphens, and spaces.'
    }
    return 'Phone number must contain 10 digits.'
  },
]

export const alphanumeric = [
  (value: string) =>
    !value ||
    /^[a-z0-9]+$/i.test(value) ||
    'Only alphanumeric characters are allowed.',
]

export const nameRules = [
  (value: string) =>
    !value ||
    /^[a-z0-9 ._'-]*$/i.test(value) ||
    'Only alphanumeric characters and spaces are allowed.',
]

export const nonNumericCharacter = [
  (value: string) =>
    !value ||
    /\D/.test(value) ||
    'Must contain at least one non-numeric character.',
]

export const passwordMatch = (password: string) => [
  (value: string) => {
    return password === value || 'Passwords must match.'
  },
]

export const urlFormat = [
  (value: string) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator
    return pattern.test(value) || 'URL must be valid.'
  },
]

export const hydroShareUrl = [
  (value: string) => {
    const urlPattern =
      /^(https?:\/\/(www\.)?hydroshare\.org\/resource\/[a-z0-9]+\/?)$/i

    return urlPattern.test(value) || 'Must be a valid HydroShare resource URL.'
  },
]

export const rules = {
  minLength,
  maxLength,
  lessThan,
  greaterThan,
  alphanumeric,
  nameRules,
  passwordMatch,
  required,
  requiredNumber,
  emailFormat,
  urlFormat,
  phoneNumber,
  nonNumericCharacter,
  hydroShareUrl,

  email: [...required, ...emailFormat],
  password: [...required, ...minLength(8), ...nonNumericCharacter],
  name: [...maxLength(200)],
  requiredName: [...required, ...maxLength(200)],
  description: [...maxLength(3000)],
  requiredDescription: [...maxLength(3000), ...required],
  requiredCode: [...maxLength(200), ...required],
}

// Starter code for Vuelidate if we ever decide to use it
// import { Validation, useVuelidate } from '@vuelidate/core'
// import { Ref } from 'vue'
// export class HsFormValidator {
//   instance: Ref<Validation>
//   constructor(rules: any, state: any) {
//     this.instance = useVuelidate(rules, state)
//   }
//   get validate() {
//     return this.instance.value.$validate
//   }
//   /** Returns event handlers for a field */
//   handlers(field: Validation) {
//     // const field = this.instance.value[name]
//     return {
//       input: field.$touch,
//       blur: field.$touch,
//     }
//   }
//   /** Returns attributes for a field */
//   attrs(field: Validation) {
//     return {
//       'error-messages': field.$errors.map((e: any) => e.$message),
//       counter: field.maxLength?.$params.max || undefined,
//       class: { 'is-required': field.value?.hasOwnProperty('required') },
//     }
//   }
// }

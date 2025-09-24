import { ref, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

export function useValidateForm() {
  const { handleSubmit, isSubmitting, submitCount } = useForm()

  const { value: eEmail, errorMessage: eError } = useField(
    'email',
    yup.string().trim().required('Введите email').email('Некорректный email')
  )

  const { value: pPassword, errorMessage: pError } = useField(
    'password',
    yup
      .string()
      .trim()
      .required('Введите пароль')
      .min(6, 'Пароль должен быть больше 6 символов')
  )

  const { value: cPassword, errorMessage: cError } = useField(
    'confirm',
    yup
      .string()
      .trim()
      .required('Введите пароль')
      .min(6, 'Пароль должен быть больше 6 символов')
  )

  const confirmError = ref('')

  watch([pPassword, cPassword], ([newPass, newConfirm]) => {
    if (newConfirm && newPass !== newConfirm) {
      confirmError.value = 'Пароли не совпадают'
    } else {
      confirmError.value = ''
    }
  })

  return {
    eError,
    eEmail,
    handleSubmit,
    isSubmitting,
    pPassword,
    pError,
    cPassword,
    cError,
    confirmError,
    submitCount,
  }
}

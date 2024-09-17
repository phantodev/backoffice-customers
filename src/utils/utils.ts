import { IViaCEP, IViaCEPError } from '@/interfaces/cep'
import axios from 'axios'

/**
 * Formata um valor numérico para a moeda brasileira (BRL).
 *
 * @param value - O número que será formatado.
 * @returns Uma string com o valor formatado em moeda brasileira.
 *
 * @example
 * ```typescript
 * formatCurrency(123456.78); // retorna 'R$ 123.456,78'
 * ```
 */
export function formatCurrency(value: number | string) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Formata um documento (CPF ou CNPJ) de acordo com o tipo fornecido.
 *
 * @param documentType - O tipo do documento que será formatado. Deve ser 'CPF' ou 'CNPJ'.
 * @param value - A string que representa o número do documento.
 * @returns Uma string com o número do documento formatado.
 *
 * @example
 * ```typescript
 * formatDocument('CPF', '12345678909'); // retorna '123.456.789-09'
 * formatDocument('CNPJ', '12345678901234'); // retorna '12.345.678/9012-34'
 * ```
 */
export function formatDocument(documentType: string, value: string) {
  value = value.replace(/\D/g, '')
  switch (documentType) {
    case 'CPF':
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      break

    case 'CNPJ':
      value = value.replace(/(\d{2})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1/$2')
      value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      break

    default:
      break
  }
  return value
}

/**
 * Capitaliza a primeira letra de cada palavra em uma string.
 *
 * @param value - A string que será capitalizada.
 * @returns Uma nova string com a primeira letra de cada palavra em maiúsculas.
 *
 * @example
 * ```typescript
 * capitalize('hello world'); // retorna 'Hello World'
 * ```
 *
 * @observações
 * Esta função não modifica a string original.
 * Ela apenas retorna uma nova string com a primeira letra de cada palavra em maiúsculas.
 *
 * @lançamentos
 * Lançará um erro se a entrada não for uma string.
 */
export function capitalize(value: string) {
  if (typeof value !== 'string') {
    throw new Error('A entrada deve ser uma string')
  }
  return value.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
}

export function formatDocumentNew(document: string): string {
  const clearDocument = document.replace(/\D/g, '')
  switch (clearDocument.length) {
    case 11:
      return clearDocument.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      )
    case 14:
      return clearDocument.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      )
    default:
      return clearDocument
  }
}

export function clearDocument(document: string): string {
  return document.replace(/\D/g, '')
}

export async function getAddressByCEP(
  cep: string,
): Promise<IViaCEP | IViaCEPError> {
  const clearCEP = cep.replace(/\D/g, '')
  const response = await axios.get(`https://viacep.com.br/ws/${clearCEP}/json/`)
  return response.data
}

export function maskCEP(cep: string): string {
  const clearCep = cep.replace(/\D/g, '')
  if (clearCep.length > 5) {
    return clearCep.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }
  return clearCep
}
export function maskPhone(phone: string): string {
  const clearPhone = phone.replace(/\D/g, '').slice(0, 11) // Remove não-números e limita a 11 dígitos

  const parts = []

  if (clearPhone.length > 0) {
    parts.push(`(${clearPhone.substring(0, 2)}`)
  }
  if (clearPhone.length > 2) {
    parts.push(`) ${clearPhone.substring(2, 7)}`)
  }
  if (clearPhone.length > 7) {
    parts.push(`-${clearPhone.substring(7, 11)}`)
  }

  return parts.join('')
}

interface DatePickerValue {
  year: number
  month: number
  day: number
}

export function formatDateFromDataPicker(
  datePickerValue: DatePickerValue,
): string {
  const { year, month, day } = datePickerValue

  // Mês no objeto do DatePicker é baseado em 1 (1-12), não precisamos ajustar
  const formattedMonth = month.toString().padStart(2, '0')
  const formattedDay = day.toString().padStart(2, '0')

  return `${year}-${formattedMonth}-${formattedDay}`
}

/* ========================================== */
/* FUNÇÃO PARA CALCULAR VOLUME
/* ========================================== */

export function calculateVolume(width: number, height: number, depth: number) {
  const volume = width * height * depth
  // Converter para string com duas casas decimais
  const volumeString = volume.toFixed(2)
  return volumeString
}

/* ================================================== */
/* FUNÇÃO PARA CONVERTER PREÇO DE STRING PARA DECIMAL
/* ================================================== */

export function convertPriceFromStringToDecimal(price: string) {
  // Remove todos os pontos e substitui a vírgula por ponto
  return price.replace(/\./g, '').replace(',', '.')
}

/* ========================================== */
/* FUNÇÃO PCONVERTER DATA PARA FORMATO BR
/* ========================================== */
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function formatDecimalInput(input: string) {
  // Remove caracteres não numéricos
  const cleanInput = input.replace(/\D/g, '')

  // Verifica se o input é vazio
  if (cleanInput === '') {
    return ''
  }

  // Insere o ponto decimal na posição correta
  const number = parseInt(cleanInput, 10)
  if (!isNaN(number)) {
    return (number / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } else {
    return ''
  }
}

export const formatCurrencyForBackend = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')
  const floatValue = parseFloat(numericValue) / 100
  return floatValue.toFixed(2)
}

export const formatCurrencyFromBackend = (value: string): string => {
  // Remove zeros à direita após o ponto decimal
  const trimmedValue = value.replace(/\.?0+$/, '')

  // Converte para número
  const numValue = parseFloat(trimmedValue)

  // Formata o número para o padrão brasileiro
  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos do CPF
  const cleanCPF = cpf.replace(/[^\d]/g, '')

  // Verifica se o CPF tem 11 dígitos
  if (
    cleanCPF.length !== 11 ||
    cleanCPF === '00000000000' ||
    cleanCPF === '11111111111' ||
    cleanCPF === '22222222222' ||
    cleanCPF === '33333333333' ||
    cleanCPF === '44444444444' ||
    cleanCPF === '55555555555' ||
    cleanCPF === '66666666666' ||
    cleanCPF === '77777777777' ||
    cleanCPF === '88888888888' ||
    cleanCPF === '99999999999'
  ) {
    return false
  }

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }

  // Calcula o primeiro dígito verificador
  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false
  }

  // Calcula o segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false
  }

  // CPF válido
  return true
}

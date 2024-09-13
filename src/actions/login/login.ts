import { api } from '@/configs/axiosInstance'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(email: string, password: string) {
  // ATENÇÃO: Em cenários reais, para enviar um email e senha para uma ROTA em uma api, usa-se um POST e envia-se e-mail e senha no body da requisição.
  // Infelizmente o JSON-SERVER é configurado para inserir um dado no db.json quando fazemos um POST, então neste curso estamos usando apenas o GET
  // para SIMULAR um LOGIN, mas lembre-se de usar o POST.
  const response = await api.get('/login')
  return response.data
}

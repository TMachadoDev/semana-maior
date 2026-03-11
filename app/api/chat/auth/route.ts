import Ably from 'ably'

export async function GET() {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY || 'SUA_CHAVE_AQUI')
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'semana-maior-user' })
  return Response.json(tokenRequestData)
}

import { sign } from '../../services/jwt'
import { success } from '../../services/response'
import { User } from '../user'
import https from 'https'
import querystring from 'querystring'

// ─── LOGIN EMAIL / SENHA (existente) ─────────────────────────────────────────
export const login = ({ user }, res, next) =>
  sign(user.id)
    .then((token) => ({ token, user: user.view(true) }))
    .then(success(res, 201))
    .catch(next)

// ─── LOGIN GOOGLE ─────────────────────────────────────────────────────────────
// Recebe o authorization code do frontend, troca pelo idToken na API do Google,
// busca ou cria o usuário no MongoDB e retorna { token, user }.
export const loginGoogle = (req, res, next) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ valid: false, message: 'code is required' })
  }

  // Dados da credencial — preencha com os seus
 const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const REDIRECT_URI         = 'postmessage'          // valor fixo quando ux_mode é 'popup'

  // Troca o authorization code pelo id_token na API do Google
  const postData = querystring.stringify({
    code,
    client_id:     GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri:  REDIRECT_URI,
    grant_type:    'authorization_code',
  })

  const options = {
    hostname: 'oauth2.googleapis.com',
    path:     '/token',
    method:   'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  }

  const tokenReq = https.request(options, (tokenRes) => {
    let data = ''
    tokenRes.on('data', (chunk) => { data += chunk })
    tokenRes.on('end', () => {
      try {
        const tokenPayload = JSON.parse(data)

        if (tokenRes.statusCode !== 200 || tokenPayload.error) {
          return res.status(401).json({ valid: false, message: 'Failed to exchange Google code', detail: tokenPayload })
        }

        // Decodifica o id_token (JWT) para pegar email, name, picture
        // O id_token é um JWT — o payload está na parte do meio em base64
        const idTokenParts  = tokenPayload.id_token.split('.')
        const idTokenPayload = JSON.parse(Buffer.from(idTokenParts[1], 'base64url').toString())

        const { email, name, picture } = idTokenPayload

        if (!email) {
          return res.status(401).json({ valid: false, message: 'No email returned from Google' })
        }

        // Busca ou cria o usuário no MongoDB
        User.findOne({ email })
          .then((existingUser) => {
            if (existingUser) return existingUser

            // Usuário novo — cria com senha aleatória (só usará Google para login)
            const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!'
            return User.create({
              email,
              name:     name || email.replace(/^(.+)@.+$/, '$1'),
              picture:  picture || undefined,
              password: randomPassword,
              role:     'user',
            })
          })
          .then((user) => sign(user.id).then((token) => ({ token, user: user.view(true) })))
          .then(success(res, 201))
          .catch(next)

      } catch (err) {
        next(err)
      }
    })
  })

  tokenReq.on('error', next)
  tokenReq.write(postData)
  tokenReq.end()
}

import { success, notFound } from '../../services/response/'
import { sendMail } from '../../services/sendgrid'
import { PasswordReset } from '.'
import { User } from '../user'

export const create = ({ bodymen: { body: { email, link } } }, res, next) =>
  User.findOne({ email })
    .then(notFound(res))
    .then((user) => user ? PasswordReset.create({ user }) : null)
    .then((reset) => {
      if (!reset) return null
      const { user, token } = reset
      link = `${link.replace(/\/$/, '')}/${token}`
      const content = `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f4f6f8; border-radius: 16px;">
    <h2 style="color: #1a2332; margin-bottom: 8px;">🔐 Redefinição de senha</h2>
    <p style="color: #4b5563;">Olá, <strong>${user.name}</strong>!</p>
    <p style="color: #4b5563;">Recebemos uma solicitação para redefinir a senha da sua conta no <strong>PreçoLeite</strong>.</p>
    <p style="color: #4b5563;">Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${link}" style="background: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px;">
        Redefinir minha senha
      </a>
    </div>
    <p style="color: #9ca3af; font-size: 13px;">Se você não solicitou isso, ignore este e-mail — sua senha permanece a mesma.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">PreçoLeite · Monitoramento do mercado de leite</p>
  </div>
`
      return sendMail({ toEmail: email, subject: 'PreçoLeite - Redefinição de senha', content })
    })
    .then(([response]) => response ? res.status(response.statusCode).end() : null)
    .catch(next)

export const show = ({ params: { token } }, res, next) =>
  PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => reset ? reset.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ params: { token }, bodymen: { body: { password } } }, res, next) => {
  return PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => {
      if (!reset) return null
      const { user } = reset
      return user.set({ password }).save()
        .then(() => PasswordReset.deleteMany({ user }))
        .then(() => user.view(true))
    })
    .then(success(res))
    .catch(next)
}

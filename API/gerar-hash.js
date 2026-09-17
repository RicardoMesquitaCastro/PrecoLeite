import bcrypt from 'bcrypt'

const senha = 'Mesquitaa@123'
const rounds = 9

bcrypt.hash(senha, rounds).then((hash) => {
  console.log(hash)
})
// para senha esquecida, quebra de criptografia

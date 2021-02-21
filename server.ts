import express from 'express'

const main = async () => {
  const app = express()

  const port = 3000
  app.listen(port, () => console.log(`listening on port ${port}`))
}

main().catch((err) => {
  console.log(err)
})

const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-router')

const devices = require('./devices')
devices.setup({
  'office': '50:C7:BF:4E:33:C4',
  'bedroom': '50:C7:BF:C5:A7:BB'
})

const router = new Router()

router.get('/devices', async ctx => {
  const data = devices.getAllStates()
  ctx.response.status = 200
  ctx.response.body = data
})

router.get('/device/:key', async ctx => {
  const {key} = ctx.params
  const state = devices.getState(key)
  ctx.response.status = 200
  ctx.response.body = {[key]: state}
})

router.post('/device/:key/:state', async ctx => {
  const {key, state} = ctx.params
  if (state === 'on') {
    devices.turnOn(key)
  }
  if (state === 'off') {
    devices.turnOff(key)
  }
  ctx.response.status = 200
  ctx.response.body = {[key]: 'done'}
})

const app = new Koa()

app
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000, () => console.log('listening on *:3000'))

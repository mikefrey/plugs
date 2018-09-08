const { Client } = require('tplink-smarthome-api')

const devicesByKey = {}
const devicesByMac = {}

const client = new Client()

// Look for devices, log to console, and turn them on
client.on('device-new', device => {
  console.log(`device-new: ${device.alias} ${device.mac} ${device.relayState}`)
  const d = devicesByMac[device.mac]
  d.device = device

  device.on('power-on', () => d.state = 1)
  device.on('power-off', () => d.state = 0)
})

exports.setup = map => {
  Object.keys(map).forEach(k => {
    const d = {
      key: k,
      mac: map[k]
    }
    devicesByKey[k] = d
    devicesByMac[map[k]] = d
  })
  client.startDiscovery()
}

exports.turnOn = key => {
  const d = devicesByKey[key]
  if (d && d.device) {
    d.device.setPowerState(true)
      .catch(err => {
        console.error(err)
      })
  }
}

exports.turnOff = key => {
  const d = devicesByKey[key]
  if (d && d.device) {
    d.device.setPowerState(false)
      .catch(err => {
        console.error(err)
      })
  }
}

exports.getState = key => {
  const d = devicesByKey[key]
  if (d && d.device) {
    return d.device.relayState ? 'on' : 'off'
  }
  return 'unknown'
}

exports.getAllStates = () => {
  return Object.entries(devicesByKey).reduce((m, [k, v]) => (m[k] = v.device.relayState, m), {})
}
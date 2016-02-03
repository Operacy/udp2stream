var test = require('tape')
var dgram = require('dgram')
var isstream = require('isstream')
var isReadable = isstream.isReadable
var udp_server = require('../index.js')

var config = { port: 1234 }

var client = dgram.createSocket('udp4')
var server = udp_server.listen({port: config.port})

// Test server setup
test('udp_server setup', function (t) {
  t.plan(4)

  // Test if udp_server({port: 12345}) returns a stream (readable)
  t.ok(isstream(server), 'is a stream')

  // Test if udp_server returns a readable stream
  t.ok(isReadable(server), 'is a readable stream')

  // Test that returned stream is object mode
  t.ok(server._readableState && server._readableState.objectMode, 'stream is in objectMode')

  // Test structure of returned object
  setTimeout(function () {
    var adr = server.socket && server.socket.address()
    t.ok(adr.port === config.port, 'binds to correct port (' + adr.port+')')
  }, 1000)

})

// Test receiving messages
test('udp_server receiving', function (t) {
  t.plan(5)

  var client = dgram.createSocket('udp4')
  var message = 'Hello'

  // Test send message
  client.send(message, 0, message.length, config.port, 'localhost', function (err) {
    t.notOk(err, 'No error')
    client.close();
  });

  // Test receiving message
  server.on('data', function (data) {
    t.equal(data.request.message.toString(), message, 'Message received is equal to message sent: ' + message)
    t.ok(typeof data.reply === 'function', 'reply is a function')
    t.ok(Buffer.isBuffer(data.request.message), 'Receves request.message as Buffer')
    t.ok(data.request.client.address && data.request.client.port, 'Receives request.client object with address and port')
  })
})

test.onFinish(function () {
  console.log('All done')
  // CLose stream and socket.
  udp_server.close()
})

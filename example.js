var udp_server = require('./index.js')
var through2 = require('through2')

var parse = through2.obj(function (udp, _, next) {
  this.push(udp)
  next()
})

var log = through2.obj(function (udp, _, next) {
  this.push(udp)
  next()
})

var ack = through2.obj(function (udp, _, next) {
  console.log('Received message ' + udp.request.message.toString() + ' from ' + udp.request.client.address + ':' + udp.request.client.port)
  udp.reply('Acking ok')
  this.push(udp)
  next()
})

var tracker = {
  parse: parse,
  log: log,
  ack: ack
}

//var server = udp_server({address: '192.168.0.109', port: 51233 })
var server = udp_server({port: 51233})

server
  .pipe(tracker.parse)
  .pipe(tracker.log)
  .pipe(tracker.ack)
//  .pipe(broadcast)  // broadcast to subscribers
  .on('data', function (data) {
    // console.log('Data')
    // console.log(data)
  })
  .on('error', function (error) {
    console.log(error)
    // statsd | sentry | ++ logging?
  })


// Handle critical errors by terminating script
process.on('uncaughtException', function (err) {
  console.error(err.stack)
  process.exit(1)
})

/*
 Evt:
 server
 .pipeline( // pumpify or mississippi
   parse,
   log,
   ack,
   function (err) {
     console.log(err)
   }
 )
*/

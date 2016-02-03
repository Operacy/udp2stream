## Streaming UDP server

Sets up a simple udp receiver which pushes received udp messages
onto a readstream as objects containing the received message,
info about the remote client, and a reply function.

    var udp_server = require('./index.js')
    var through2 = require('through2')

    var reply_to_request = through2.obj(function (udp, _, next) {
      console.log('Received message ' + udp.request.message.toString() + ' from ' + udp.request.client.address + ':' + udp.request.client.port)
      udp.reply('This is my reply to the client')
      this.push(udp)
      next()
    })

    var server = udp_server.listen({port: 1234})

    server
    .pipe(reply_to_request)
    .on('data', function (data) {
      console.log(data)
    })
    .on('error', function (error) {
      console.log(error)
    })

    setTimeout(function () {
      // close the server
      server.close()
    }, 10000)

### API

#### udp_server.listen(options)
* options.port: udp_port to bind to
* options.address: udp_address to bind to

#### udp_server.close()
Stop listening, close server.

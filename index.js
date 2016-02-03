var dgram = require('dgram')
var stream = require('readable-stream')

var socket
var _stream = stream.Readable({objectMode: true})

_stream._read = function (size) { } // Defined as formality. Does not do anything

module.exports = {

  listen: function (options) {
    var _options = {
      type: options.type || 'udp4',
      reuseAddr: options.reuseAddr
    }

    socket = dgram.createSocket(_options)

    if (options.port) {
      socket.bind(options.port, options.address, function () {
        console.log('Binding to : ' + (options.address || '127.0.0.1') + ':' + options.port)
      })
    }

    socket.on('message', function (message, rinfo) {
      // Every time udp message is received, an object with all info is pushed onto stream
      _stream.push({
        request: {
          message: message,
          client: rinfo
        },
        reply: function (message, callback) {
          var client = dgram.createSocket(options.type || 'udp4')
          client.send(message, 0, message.length, rinfo.port, rinfo.address, function (err) {
            if (err && callback) callback(err)
            client.close()
          })
        }
      })
    })

    socket.on('error', function (error) {
      _stream.emit('error', error)
      _stream.push(null)
      socket.close()
    })

    socket.on('listening', function () {
      _stream.socket = socket
    })

    return _stream

  },

  close: function () {
    _stream.push(null)
    socket.close()
  }

}


const normalMessages = require("./socketBackend/helpers/normalChat")
const connections = require("./socketBackend/helpers/connections")

const socktetBackend = (server) => {
    const socket = require("socket.io")
    const io = socket(server)

    //Setting up first connection
    io.sockets.on('connection', (socket) => {
        console.log("socket backend connected")

        // when user go to website/chat at frontend this
        // socket event will be emmited from front-end
        connections(socket, io)

        //when any user send message

        normalMessages(socket, io)


    })





}

module.exports = socktetBackend


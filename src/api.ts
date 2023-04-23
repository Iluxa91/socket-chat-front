import {io, Socket} from "socket.io-client";

export const api = {
    socket: null as null | Socket,

    subscribe(initMessagesHandler: (messages: any) => void, newMessageSentHandler: (message: string) => void, userTypingHandler: (user: any) => void) {
        if (this.socket) {
            this.socket.on("init-messages-published", initMessagesHandler)
            this.socket.on("new-message-sent", newMessageSentHandler)
            this.socket.on("user-typing", userTypingHandler)
        }
    },

    createConnection() {
        this.socket = io("http://localhost:3009/", {
            withCredentials: true,
        })
    },

    destroyConnection() {
        this.socket && this.socket.disconnect()
        this.socket = null
    },

    sendName(name: string) {
        this.socket && this.socket.emit("client-name-sent", name)
    },

    sendMessage(message: string) {
        this.socket && this.socket.emit("client-message-sent", message, (error: string)=>{
            error && alert(error)
        })
    },

    typeMessage() {
        this.socket && this.socket.emit("client-typed")
    }
}
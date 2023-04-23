import {api} from "./api";

const initialState = {
    messages: [],
    typingUsers: []
}

export const chatReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case "messages-received": {
            return {...state, messages: action.messages}
        }
        case "new-message-received": {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter((u: any) => u.id !== action.message.user.id)
            }
        }

        case "typingUserAdded": {
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter((u: any) => u.id !== action.user.id), action.user]
            }
        }
        default:
            return state
    }
}

export const createConnection = () => (dispatch: any) => {
    api.createConnection()
    api.subscribe((messages: any) => {
            dispatch(messagesReceived(messages))
        }, (message: string) => {
            dispatch(newMessageReceived(message))
        },
        (user: any) => {
            dispatch(typingUserAdded(user))
        })
}

export const destroyConnection = () => () => {
    api.destroyConnection()
}

export const setClientName = (name: string) => () => {
    api.sendName(name)
}

export const typeMessage = () => () => {
    api.typeMessage()
}

export const sendClientMessage = (message: string) => () => {
    api.sendMessage(message)
}

const messagesReceived = (messages: any) => ({type: "messages-received", messages})

const typingUserAdded = (user: any) => ({type: "typingUserAdded", user})

const newMessageReceived = (message: string) => ({
    type: "new-message-received",
    message
})

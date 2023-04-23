import React, {useEffect, useRef, useState} from "react";
import "./App.css";
import {
    createConnection,
    destroyConnection,
    sendClientMessage,
    setClientName, typeMessage
} from "./chat-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./index";
import { ThunkDispatch } from "redux-thunk";
import {AnyAction} from "redux";

export type MessageType = {
    message: string,
    id: string,
    user: {
        id: string,
        name: string
    }
}

type MyThunkDispatch = ThunkDispatch<AppStateType, undefined, AnyAction>

function App() {
    const messages = useSelector<AppStateType, MessageType[]>((state: AppStateType) => state.chat.messages)
    const typingUsers = useSelector<AppStateType, Array<any>>((state: AppStateType) => state.chat.typingUsers)
    const dispatch = useDispatch<MyThunkDispatch>()

    const [message, setMessage] = useState("")
    const [name, setName] = useState("")
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        }
    }, [])

    useEffect(() => {
        if (isAutoScrollActive && messagesAnchorRef.current) {
            messagesAnchorRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    const onScroll = (e: React.UIEvent<HTMLElement>) => {
        const element = e.currentTarget

        const maxScrollPosition = element.scrollHeight - element.clientHeight

        if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop)) {
            setIsAutoScrollActive(true)
        } else {
            setIsAutoScrollActive(false)
        }
        setLastScrollTop(element.scrollTop)
    }

    return (
        <div className="App">
            <div>
                <div style={{
                    border: "1px solid black",
                    padding: "10px",
                    height: "300px",
                    width: "300px",
                    overflowY: "scroll"
                }}
                     onScroll={onScroll}
                >
                    {
                        messages.map((m, i) => {
                            return <div key={i}>
                                <b>{m.user.name}: </b>{m.message}
                                <hr/>
                            </div>
                        })
                    }
                    {
                        typingUsers.map((m, i) => {
                            return <div key={i}>
                                <b>{m.name}: </b> ...
                            </div>
                        })
                    }
                    <div ref={messagesAnchorRef}/>
                </div>
                <div>
                    <input type="text" value={name}
                           onKeyPress={()=>dispatch(typeMessage())}
                           onChange={(e) => setName(e.currentTarget.value)}/>
                    <button onClick={() =>
                        dispatch(setClientName(name))
                    }>send name
                    </button>
                </div>
                <textarea value={message} onChange={(e) => {
                    setMessage(e.currentTarget.value)
                }}/>
                <button onClick={() => {
                    dispatch(sendClientMessage(message))
                    setMessage("")
                }}>Send
                </button>
            </div>
        </div>
    )
        ;
}

export default App

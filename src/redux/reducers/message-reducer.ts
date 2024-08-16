import { createSlice } from "@reduxjs/toolkit"
import { MessageModel } from "../../models/message.model"

export type Messages = {
    items: MessageModel[],
    pageNo: number,
    totalPage: number
}

const initialState: Messages = {
    items: [],
    pageNo: 1,
    totalPage: 1
}

export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, actions) => {
            state.items = [ actions.payload, ...state.items ];
        },
        initMessage: (state, actions) => {
            state.items = actions.payload;
        },
        addMessages: (state, actions) => {
            state.items = [ ...state.items, ...actions.payload ]
        },
        setPageNo: (state, action) => {
            state.pageNo = action.payload;
        },
        setTotalPage: (state, action) => {
            state.totalPage = action.payload;
        }
    },
})

export const { addMessage, initMessage, addMessages, setPageNo, setTotalPage } = messageSlice.actions

export default messageSlice.reducer
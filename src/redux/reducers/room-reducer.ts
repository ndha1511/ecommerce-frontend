import { createSlice } from "@reduxjs/toolkit"
import { RoomModel } from "../../models/room.model"

export type Rooms = {
    items: RoomModel[],
    currentState: RoomModel | null,
    pageNo: number,
    totalPage: number
}

const initialState: Rooms = {
    items: [],
    currentState: null,
    pageNo: 1,
    totalPage: 1
}

export const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        addRoom: (state, actions) => {
            state.items = [...state.items, actions.payload];
        },
        initRooms: (state, actions) => {
            state.items = actions.payload;
        },
        addRooms: (state, actions) => {
            state.items = [...state.items,...actions.payload];
        },
        setPageNo: (state, action) => {
            state.pageNo = action.payload;
        },
        setTotalPage: (state, action) => {
            state.totalPage = action.payload;
        },
        setCurrentRoom: (state, action) => {
            state.currentState = action.payload;
        }
    },
})

export const { addRoom, initRooms, addRooms, setPageNo, setTotalPage, setCurrentRoom } = roomSlice.actions

export default roomSlice.reducer
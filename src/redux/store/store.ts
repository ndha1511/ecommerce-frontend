import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../reducers/cart-reducer'
import notificationReducer from '../reducers/notification-reducer'
import roomReducer from '../reducers/room-reducer'
import messageReducer from '../reducers/message-reducer'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    notification: notificationReducer,
    rooms: roomReducer,
    messsage: messageReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {
        username: null,
        email: null,
        token: null,
        avatar: null,
        coins: 0
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        update: (state, action) => {
            const {username, email, token, avatar, coins} = action.payload
            if (username) {state.value.username = username}
            if (email) {state.value.email = email}
            if (token) {state.value.token = token}
            if (avatar) {state.value.avatar = avatar}
            if (coins) {state.value.coins = coins}
        },
        logout : state => {
            state.value.username = null
            state.value.email = null
            state.value.avatar = null
            state.value.token = null
            state.value.coins = 0
        }
    }
})

export const {update, logout} = userSlice.actions
export default userSlice.reducer
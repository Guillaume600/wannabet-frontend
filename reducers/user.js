import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {
        username: null,
        email: null,
        token: null,
        coins: 0
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        update: (state, action) => {
            const {username, email, token, coins} = action.payload
            username && (state.value.username = username)
            email && (state.value.email = email)
            token && (state.value.token = token)
            coins && (state.value.coins = coins)
        },
        logout : state => {
            state.value.username = null
            state.value.email = null
            state.value.token = null
            state.value.coins = 0
        }
    }
})

export const {update, logout} = userSlice.actions
export default userSlice.reducer
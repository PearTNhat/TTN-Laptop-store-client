import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { sideBarReducer } from "./slice/sideBar";
import { userReducer } from "./slice/userSlice";
import { modalReducer } from "./slice/modal";

const persistConfig = {
    key: 'shop/user',
    storage,
    //whitelist:['accessToken','isLoggedIn','userData'] // only token will be persisted, other will be cleared after
}
const persistedReducer = persistReducer(persistConfig, userReducer)
const store = configureStore({
    reducer: {
        sideBar: sideBarReducer,
        modal: modalReducer,
        user: persistedReducer, // use persisted reducer for user
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
const persistor = persistStore(store)
export { store, persistor }
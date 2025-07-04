import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { appReducer } from "./slice/app";
import { sideBarReducer } from "./slice/sideBar";

// const persistConfig = {
//     key: 'shop/user',
//     storage,
//     //whitelist:['accessToken','isLoggedIn','userData'] // only token will be persisted, other will be cleared after
// }
// const persistedReducer = persistReducer(persistConfig, userReducer)
const store = configureStore({
    reducer: {
        sideBar: sideBarReducer,
        app: appReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
const persistor = persistStore(store)
export { store, persistor }
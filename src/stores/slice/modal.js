// cái này xài mấy cái biến global khác
import { createSlice } from '@reduxjs/toolkit';
const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isShowModal: false,
        childrenModal: null,
        animation: false
    },
    reducers: {
        toggleModal: (state, action) => {
            console.log(action.payload);
            state.isShowModal = action.payload.isShowModal;
            state.childrenModal = action.payload.childrenModal
            state.animation = action.payload.animation
        },
    },
});
const modalReducer = modalSlice.reducer;
const modalActions = modalSlice.actions;
export { modalReducer, modalActions };
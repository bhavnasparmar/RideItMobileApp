import { createSlice } from '@reduxjs/toolkit';
import { ambulanceAction, ambulancebook } from '../actions/ambulanceAction'
import { AmbulanceInterface } from '../../interface/ambulanceInterface';


const initialState: AmbulanceInterface = {
    ambulanceList: [],
    ambulanceRequest: [],
    token: '',
    loading: false,
    success: false,
    fcmToken: '',
};



const ambulanceSlice = createSlice({
    name: 'ambulance',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(ambulanceAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(ambulanceAction.fulfilled, (state, action) => {
            state.ambulanceList = action.payload;
            state.loading = false;
        });



        builder.addCase(ambulancebook.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(ambulancebook.fulfilled, (state, action) => {
            state.loading = false;
            state.ambulanceRequest = action.payload;
            state.success = true;
        });
        builder.addCase(ambulancebook.rejected, (state) => {
            state.loading = false;
            state.success = false;
        });


    }
});
export default ambulanceSlice.reducer;
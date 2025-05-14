import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {vehicleTypeDataGet,vehicleData} from '../actions/vehicleTypeAction'
import { VehicleTypeInterface } from '../../interface/vehicleTypeInterface';


const initialState: VehicleTypeInterface = {
    vehicleTypedata: [],
    allVehicle: [],
    token: '',
    loading: false,
    success: false,
    fcmToken: '',
};


const vehicleTypeSlice = createSlice({
    name: 'vehicleType',
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder.addCase(vehicleTypeDataGet.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(vehicleTypeDataGet.fulfilled, (state, action) => {
        state.vehicleTypedata = action.payload;
        state.loading = false;
      });
      builder.addCase(vehicleTypeDataGet.rejected, (state) => {
        state.loading = false;
        state.success = false;
      });



      builder.addCase(vehicleData.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(vehicleData.fulfilled, (state, action) => {
        state.allVehicle = action.payload;
        state.loading = false;
      });
      builder.addCase(vehicleData.rejected, (state) => {
        state.loading = false;
        state.success = false;
      });


    }
  });
  
  export default vehicleTypeSlice.reducer;
  
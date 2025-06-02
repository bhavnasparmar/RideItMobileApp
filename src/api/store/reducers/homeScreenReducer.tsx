import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { homeScreenData, homeScreenPrimary } from '../actions/homeScreenAction';
import { HomeScreenInterface } from '../../interface/homeScreenInterface';

const initialState: HomeScreenInterface = {
    homeScreenData: [],
    homeScreenDataPrimary: {
        banners :[{banner_image_url : require('../../../assets/images/banner.jpg')},{banner_image_url : require('../../../assets/images/banner2.png')},{banner_image_url : require('../../../assets/images/banner3.jpg')}]
    ,service_categories:[{service_category_image_url : require('../../../assets/images/rides.png'),name : 'Ride'},
        {service_category_image_url : require('../../../assets/images/carLuggage.png'),name : 'Intercity'},
        {service_category_image_url : require('../../../assets/images/rentalCar.png'),name : 'Rental'},
         {service_category_image_url : require('../../../assets/images/calenderCar.png'),name : 'Scheduled'}
    ],
    recent_rides : [{}],
     coupons : []
    },
    success: false,
    loading: false,
    statusCode: null,
};

const homescreenSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomePrimaryData: (state) => {
            state.homeScreenDataPrimary = [];
        }
    },
    extraReducers: builder => {
        builder.addCase(homeScreenData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(homeScreenData.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.homeScreenData = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(homeScreenData.rejected, (state) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });


        // home primary
        builder.addCase(homeScreenPrimary.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(homeScreenPrimary.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.homeScreenDataPrimary = action.payload;
            state.statusCode = action.payload.status;
            state.loading = false;
        });
        builder.addCase(homeScreenPrimary.rejected, (state) => {
            state.loading = false;
            state.success = false;
            state.statusCode = action.payload?.status || 500;
        });
    },

});

export const { clearHomePrimaryData } = homescreenSlice.actions;


export default homescreenSlice.reducer;

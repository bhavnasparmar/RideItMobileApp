import { createSlice } from "@reduxjs/toolkit";
import {
  selfData,
  updateProfile,
  accountDelete,
} from "../actions/accountAction";

const initialState = {
  loading: false,
  self: {name : 'Prakash Kumar',phone : 9313258143,email:'Prakash@yopmail.com',country_code : '91',profile_image : {original_url : require('../../../assets/images/profileImage/profileUser.png')}},
  defaultAddress: null,
  accountDetails: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateDefaultAdd(state, action) {
      state.defaultAddress = action.payload;
    },
    financialState(state, action) {
      state.val = action.payload;
    },
    updateLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Self Cases
    builder.addCase(selfData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(selfData.fulfilled, (state, action) => {
      state.self = action.payload;
      action?.payload?.address?.map((item) => {
        if (item.is_default == 1) state.defaultAddress = item;
      });
      state.loading = false;
    });
    builder.addCase(selfData.rejected, (state, action) => {
      state.loading = false;
    });

    //UpdateProfile Cases
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {});
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
    });

    //Delete Account
    builder.addCase(accountDelete.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(accountDelete.fulfilled, (state, action) => {});
    builder.addCase(accountDelete.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { updateDefaultAdd, financialState, updateLoading } =
  accountSlice.actions;
export default accountSlice.reducer;

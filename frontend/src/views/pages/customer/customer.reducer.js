import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingCustomer, creatingCustomerStatus, creatingCustomerType, getBranches, getCity, getCustomer, getCustomerStatus, getCustomerType, getDistrict, getWard } from './customer.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  cities: [],
  districts: [],
  wards: [],
  type: [],
  branch: [],
  status: []
};

export const customersAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: customer => customer.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'customer',
  initialState: customersAdapter.getInitialState({ initialState }),
  reducers: {
    customersAddOne: customersAdapter.addOne,
    customersAddMany: customersAdapter.addMany,
    customerUpdate: customersAdapter.updateOne,
    customerRemove: customersAdapter.removeOne,
  },
  extraReducers: {
    [creatingCustomer.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
    },
    [creatingCustomerStatus.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
    },
    [creatingCustomerType.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
    },
    [getCustomer.fulfilled]: (state, action) => {
      customersAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [getCity.fulfilled]: (state, action) => {
      state.initialState.cities = action.payload
      state.initialState.loading = false;
    },
    [getDistrict.fulfilled]: (state, action) => {
      state.initialState.districts = action.payload
      state.initialState.loading = false;
    },
    [getWard.fulfilled]: (state, action) => {
      state.initialState.wards = action.payload
      state.initialState.loading = false;
    },
    [getCustomerType.fulfilled]: (state, action) => {
      state.initialState.type = action.payload
      state.initialState.loading = false;
    },
    [getCustomerStatus.fulfilled]: (state, action) => {
      state.initialState.status = action.payload
      state.initialState.loading = false;
    },
    [getBranches.fulfilled]: (state, action) => {
      state.initialState.branch = action.payload
      state.initialState.loading = false;
    },
    [getCustomer.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const globalizedCustomerSelectors = customersAdapter.getSelectors(state => state.customer);


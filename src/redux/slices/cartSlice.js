import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  itemsSelected: [],
  itemsPrice: 0,
  totalPrice: 0,
  user: '',
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {product} = action.payload
      const item = state?.items?.find((item) => item?.productId === product.productId)
      if(item){
        if(item.amount <= item.countInstock) {
          item.amount += product?.amount
        }
      }else {
        state.items.push(product)
      }
    },
    increaseAmount: (state, action) => {
      const {idProduct} = action.payload
      const item = state?.items?.find((item) => item?.product === idProduct)
      const itemSelected = state?.itemsSelected?.find((item) => item?.product === idProduct)
      item.amount++;
      if(itemSelected) {
        itemSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const {idProduct} = action.payload
      const item = state?.items?.find((item) => item?.product === idProduct)
      const itemSelected = state?.itemsSelected?.find((item) => item?.product === idProduct)
      item.amount--;
      if(itemSelected) {
        itemSelected.amount--;
      }
    },
    removeCartItem: (state, action) => {
      const {idProduct} = action.payload
      
      const item = state?.items?.filter((item) => item?.product !== idProduct)
      const itemSeleted = state?.itemsSelected?.filter((item) => item?.product !== idProduct)

      state.items = item;
      state.itemsSelected = itemSeleted;
    },
    removeMultiCartItems: (state, action) => {
      const {listChecked} = action.payload
      
      const items = state?.items?.filter((item) => !listChecked.includes(item.product))
      const itemsSelected = state?.itemsSelected?.filter((item) => !listChecked.includes(item.product))
      
      state.items = items
      state.itemsSelected = itemsSelected
    },
    selectedOrder: (state, action) => {
      const {listChecked} = action.payload
      const itemsSelected = []
      state.items.forEach((item) => {
        if(listChecked.includes(item.product)){
          itemsSelected.push(item)
        };
      });
      state.itemsSelected = itemsSelected
    }
  },
})

export const { addToCart,increaseAmount,decreaseAmount,removeCartItem,removeMultiCartItems, selectedOrder } = cartSlice.actions

export default cartSlice.reducer
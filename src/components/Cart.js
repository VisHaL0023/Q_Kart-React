import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";


export const generateCartItemsFrom = (cartData, productsData) => {
  if(!cartData) return;

  const nextCart = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));
  return nextCart;
};


export const getTotalCartValue = (items = []) => {
  if(!items.length) return 0;
  const total = items
    .map((item) => item.cost * item.qty)
    .reduce((total, n) => total + n);
  return total;
};


export const getTotalItems = (items = []) => {
  if(!items.length) return 0;
  const total = items
    .map((item) => item.qty)
    .reduce((total, n) => total + n);
  return total;
};


const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  if(isReadOnly){
    return <Box>Qty :{value}</Box>
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};


const Cart = ({
  products,
  items = [],
  handleQuantity,
  hasCheckOutButton = false,
  isReadOnly = false
}) => {

  const token = localStorage.getItem("token");
  const history = useHistory();

  const routeToCheckoutPage = () =>{
    history.push("/checkout");
  }

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items.map((item) =>(
          <Box key = {item.productId} marginBottom ="1rem" className = "boxDesign">
            {item.qty > 0 ? (
              <Box display= "flex" alignItem = "flex-start" paddign = "1rem">
                <Box className = "image-container">
                  <img 
                    src = {item.image}
                    alt = {item.name}
                    width = "100%"
                    height = "100%"
                  />
                </Box>
                <Box
                  display = "flex"
                  flexDirection = "column"
                  justifyContent = "space-between"
                  height = "6rem"
                  paddingX = "1rem"
                >
                  <div>{item.name}</div>
                  <Box
                    display = "flex"
                    justifyContent = "space-between"
                    alignItem = "center"
                  >
                  <ItemQuantity
                    handleAdd = {async () => {
                      await handleQuantity(
                        token,
                        items,
                        products,
                        item.productId,
                        item.qty + 1
                      );
                    }}
                    handleDelete = {async () => {
                      await handleQuantity(
                        token,
                        items,
                        products,
                        item.productId,
                        item.qty - 1
                      );
                    }}
                    value = {item.qty}
                    isReadOnly = {isReadOnly}
                  />
                  <Box padding = "0.5rem" fontWeight = "700">
                    ${item.cost}
                  </Box>
                </Box>
                </Box>
              </Box>
            ): null}
          </Box>
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>  
        
        {hasCheckOutButton && (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={routeToCheckoutPage}
          >
            Checkout
          </Button>
        </Box>
        )}
      </Box>

      {isReadOnly && (<Box className="cart" padding = "1rem">
        <h2>Order Details</h2>
        <Box className = "cart-row">
          <p>Products</p>
          <p>{getTotalItems(items)}</p>
        </Box>
        <Box className = "cart-row">
          <p>Subtotal</p>
          <p>${getTotalCartValue(items)}</p>
        </Box>
        <Box className = "cart-row">
          <p>Shipping charges</p>
          <p>$0</p>
        </Box>
        <Box className = "cart-row">
          <p>Total</p>
          <p>${getTotalCartValue(items)}</p>
        </Box>
      </Box>)}
    </>
  );
};

export default Cart;

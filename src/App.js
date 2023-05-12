import React, { useCallback, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import AppContext from "./context";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";
import classes from "./App.module.scss";
import { API_URL } from "./api/api";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const cartResponce = await axios.get(
          "https://63392e8c383946bc7fef9898.mockapi.io/cart"
        );
        const favoritesResponce = await axios.get(
          "https://63392e8c383946bc7fef9898.mockapi.io/favorite"
        );
        const itemsResponce = await axios.get(
          "https://63392e8c383946bc7fef9898.mockapi.io/items"
        );

        setIsLoading(false);

        setCartItems(cartResponce.data);
        setFavorites(favoritesResponce.data);
        setItems(itemsResponce.data);
      } catch (error) {
        alert("Ошибка");
      }
    }
    fetchData();
  }, []);

  const onAddToCart = useCallback(
    async (obj) => {
      try {
        const finditem = cartItems.find(
          (item) => Number(item.parentId) === Number(obj.id)
        );

        if (finditem) {
          setCartItems((prev) =>
            prev.filter((item) => Number(item.parentId) !== Number(obj.id))
          );
          await axios.delete(
            `https://63392e8c383946bc7fef9898.mockapi.io/cart/${finditem.id}`
          );
        } else {
          setCartItems((prev) => [...prev, obj]);

          const { data } = await axios.post(`${API_URL}/cart`, obj);

          setCartItems((prev) =>
            prev.map((item) => {
              if (item.parentId === data.parentId) {
                return {
                  ...item,
                  id: data.id,
                };
              }
              return item;
            })
          );
        }
      } catch (error) {
        alert("Не удалось добавить в корзизну");
      }
    },
    [cartItems]
  );

  const onRemoveItem = (id) => {
    try {
      axios.delete(`${API_URL}/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("Не удалось удалить в корзизну");
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`${API_URL}/favorite/${obj.id}`);
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(`${API_URL}/favorite`, obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить в фавориты");
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        favorites,
        items,
        isItemAdded,
        onAddToFavorite,
        setCartOpened,
        setCartItems,
        onAddToCart,
      }}
    >
      <div className={cartOpened ? classes.cartOpened : ""}>
        <div className={`wrapper clear`}>
          <Drawer
            items={cartItems}
            onClose={() => {
              setCartOpened(false);
            }}
            onRemove={onRemoveItem}
            opened={cartOpened}
          />

          <Header
            onClickCart={() => {
              setCartOpened(true);
            }}
          />

          <Routes>
            <Route
              path="/"
              exact
              element={
                <Home
                  cartItems={cartItems}
                  items={items}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  onChangeSearchInput={onChangeSearchInput}
                  onAddToFavorite={onAddToFavorite}
                  onAddToCart={onAddToCart}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="/favorites" exact element={<Favorites />} />
            <Route path="/orders" exact element={<Orders />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;

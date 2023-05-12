import React from "react";
import AppContext from "../context";

const Info = ({ image, title, description }) => {
  const { setCartOpened } = React.useContext(AppContext);

  return (
    <div className="cartEmpty d-flex flex-column flex align-center text-center justify-center">
      <img className="mb-20" src={image} alt="clearBox" />
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={() => setCartOpened(false)} className="greenButton cu-p">
        <img src="/React-Project-Sneakers/img/arrow.svg" alt="arrow" />{" "}
        Вернуться назад
      </button>
    </div>
  );
};

export default Info;

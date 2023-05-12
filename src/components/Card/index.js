import React from "react";
import ContentLoader from "react-content-loader";
import CardStyles from "./Card.module.scss";
import AppContext from "../../context";

function Card({
  onFavorite,
  onPlus,
  title,
  id,
  imageUrl,
  price,
  favorited = false,
  loading = false,
}) {
  const { isItemAdded } = React.useContext(AppContext);
  const [isFavorite, setIsFavorite] = React.useState(favorited);
  const obj = { title, imageUrl, price, id, parentId: id };

  const onClickPlus = () => {
    onPlus(obj);
  };
  const onClickFavorite = () => {
    onFavorite(obj);
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={CardStyles.card}>
      {loading ? (
        <ContentLoader
          speed={2}
          width={155}
          height={250}
          viewBox="0 0 155 265"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="1" y="0" rx="10" ry="10" width="155" height="155" />
          <rect x="0" y="167" rx="5" ry="5" width="155" height="15" />
          <rect x="0" y="187" rx="5" ry="5" width="100" height="15" />
          <rect x="118" y="230" rx="10" ry="10" width="32" height="32" />
          <rect x="1" y="234" rx="5" ry="5" width="80" height="25" />
        </ContentLoader>
      ) : (
        <>
          <div className={CardStyles.favorite} onClick={onClickFavorite}>
            <img
              src={
                isFavorite
                  ? "/React-Project-Sneakers/img/favorite.svg"
                  : "/React-Project-Sneakers/img/unfavorite.svg"
              }
              alt="unfavorite"
            />
          </div>
          <img width="100%" height={135} src={imageUrl} alt="Sneakers" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price} руб.</b>
            </div>
            {onPlus && (
              <img
                className={CardStyles.plus}
                onClick={onClickPlus}
                src={
                  isItemAdded(id)
                    ? "/React-Project-Sneakers/img/btn-checked.svg"
                    : "/React-Project-Sneakers/img/plus.svg"
                }
                alt="Plus"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;

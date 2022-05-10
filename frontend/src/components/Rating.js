import React from 'react';

const Rating = ({ value }) => {
  return (
    <>
      <span>
        <i
          className={
            value >= 1
              ? `fa-solid fa-star`
              : value >= 0.5
              ? `fa-solid fa-star-half-stroke`
              : `fa-regular fa-star`
          }
        ></i>
      </span>
      <span>
        <i
          className={
            value >= 2
              ? `fa-solid fa-star`
              : value >= 1.5
              ? `fa-solid fa-star-half-stroke`
              : `fa-regular fa-star`
          }
        ></i>
      </span>
      <span>
        <i
          className={
            value >= 3
              ? `fa-solid fa-star`
              : value >= 2.5
              ? `fa-solid fa-star-half-stroke`
              : `fa-regular fa-star`
          }
        ></i>
      </span>
      <span>
        <i
          className={
            value >= 4
              ? `fa-solid fa-star`
              : value >= 3.5
              ? `fa-solid fa-star-half-stroke`
              : `fa-regular fa-star`
          }
        ></i>
      </span>
      <span>
        <i
          className={
            value >= 5
              ? `fa-solid fa-star`
              : value >= 5.5
              ? `fa-solid fa-star-half-stroke`
              : `fa-regular fa-star`
          }
        ></i>
      </span>
    </>
  );
};

export default Rating;

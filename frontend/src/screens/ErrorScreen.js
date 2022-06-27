import React from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import classes from '../modules/ErrorPage.module.scss';

const ErrorScreen = () => {
  return (
    <div className={classes['notfound-outer']}>
      <Meta title={'Shippr | Error 404'} />
      <div className={classes.notfound}>
        <div className={classes['notfound-404']}>
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
        <Link to="/">Go To Homepage</Link>
      </div>
    </div>
  );
};

export default ErrorScreen;

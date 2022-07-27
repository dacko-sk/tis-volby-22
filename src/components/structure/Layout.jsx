import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout(props) {
  return (
    <div className="layout-default">
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout(props) {
  return (
    <layout className="default">
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </layout>
  );
}

export default Layout;

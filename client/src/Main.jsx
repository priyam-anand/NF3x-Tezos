import React from 'react';
import { useRoutes } from "react-router-dom";
import PopupLoader from './components/PopupLoader';
import CreateListing from './pages/CreateListing';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ListDetailPage from './pages/ListDetailPage';
import ListingPage from './pages/ListingPage';
import { useSelector } from "react-redux";

function Main() {
    const { loading } = useSelector((state) => state.popupState);
    return (
        <div>
            {useRoutes([
                { path: "/", element: <HomePage /> },
                { path: "/listing", element: <ListingPage /> },
                { path: "/listdetail/:collection/:tokenId", element: <ListDetailPage /> },
                { path: "/createlist", element: <CreateListing /> },
                { path: "/dashboard", element: <DashboardPage /> },
            ])}

            <PopupLoader isOpen={loading} titleContent="Completing Transaction, Please wait" />
        </div>
    )
};

export default Main;
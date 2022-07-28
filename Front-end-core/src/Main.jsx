import React from 'react';
import { useRoutes } from "react-router-dom";
import PopupAcceptOffer from './components/PopupAcceptOffer';
import PopupAuthRequired from './components/PopupAuthRequired';
import PopupCompleteListing from './components/PopupCompleteListing';
import PopupCompleteOffer from './components/PopupCompleteOffer';
import PopupConfirmSwapNow from './components/PopupConfirmSwapNow';
import PopupConfirmSwapOffer from './components/PopupConfirmSwapOffer';
import PopupContainer from './components/PopupContainer';
import PopupCounterOffer from './components/PopupCounterOffer';
import PopupLoader from './components/PopupLoader';
import PopupProposedSwapOffer from './components/PopupProposedSwapOffer';
import PopupReserveSwapLater from './components/PopupReserveSwapLater';
import PopupSummary from './components/PopupSummary';
import PopupTransactionInProgress from './components/PopupTransactionInProgress';
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
                { path: "/listdetail/:id", element: <ListDetailPage /> },
                { path: "/createlist", element: <CreateListing /> },
                { path: "/dashboard", element: <DashboardPage /> },
            ])}
            {/* <PopupContainer isOpen={false} popupTitle={"Complete Listing"}>
                <PopupCompleteListing />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Summary"}>
                <PopupSummary />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Transaction in progress"}>
                <PopupTransactionInProgress />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Complete your offer"}>
                <PopupCompleteOffer />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Your counter offer is proposed"}>
                <PopupCounterOffer />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Your NFTs are proposed against following swap offer"}>
                <PopupProposedSwapOffer />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Confirm Swap Now"}>
                <PopupConfirmSwapNow />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Reserve Now & Swap Later"}>
                <PopupReserveSwapLater />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Confirm Swap Offer"}>
                <PopupConfirmSwapOffer />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Authentication Required"}>
                <PopupAuthRequired />
            </PopupContainer>
            <PopupContainer isOpen={false} popupTitle={"Accept Swap Offer"}>
                <PopupAcceptOffer />
            </PopupContainer> */}
            <PopupLoader isOpen={loading} titleContent="Completing Transaction, Please wait" />
        </div>
    )
};

export default Main;
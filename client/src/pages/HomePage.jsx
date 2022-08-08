import React from 'react';
import DashboardCommunity from './../components/landingpage/DashboardCommunity';
import DashboardFooter from './../components/landingpage/DashboardFooter';
import DashboardHeader from './../components/landingpage/DashboardHeader';
import DashboardInfo from './../components/landingpage/DashboardInfo';
import DashboardTradingOptions from './../components/landingpage/DashboardTradingOptions';

function HomePage() {
  return (
    <div>
      <DashboardHeader />
      <DashboardTradingOptions />
      <DashboardCommunity />
      <DashboardInfo />
      <DashboardFooter />
    </div>);
}

export default HomePage;
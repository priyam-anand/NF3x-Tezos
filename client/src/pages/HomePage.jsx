import React from 'react';
import DashboardFooter from './../components/landingpage/DashboardFooter';
import DashboardHeader from './../components/landingpage/DashboardHeader';
import DashboardInfo from './../components/landingpage/DashboardInfo';
import DashboardTradingOptions from './../components/landingpage/DashboardTradingOptions';

function HomePage() {
  return (
    <div>
      <DashboardHeader />
      <DashboardTradingOptions />
      <DashboardInfo />
      <DashboardFooter />
    </div>);
}

export default HomePage;
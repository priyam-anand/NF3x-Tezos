import React from 'react';
// import DashboardBanner from './../components/landingpage/DashboardBanner';
import DashboardBlog from './../components/landingpage/DashboardBlog';
import DashboardCommunity from './../components/landingpage/DashboardCommunity';
import DashboardFooter from './../components/landingpage/DashboardFooter';
import DashboardHeader from './../components/landingpage/DashboardHeader';
import DashboardInfo from './../components/landingpage/DashboardInfo';
import DashboardPeopleMeet from './../components/landingpage/DashboardPeopleMeet';
import DashboardRoadmap from './../components/landingpage/DashboardRoadmap';
import DashboardTradingOptions from './../components/landingpage/DashboardTradingOptions';

function HomePage() {
  return (
  <div>
      <DashboardHeader/>
      {/* <DashboardBanner/> */}
      <DashboardTradingOptions/>
      {/* <DashboardPeopleMeet/> */}
      {/* <DashboardRoadmap/> */}
      {/* <DashboardBlog/> */}
      <DashboardCommunity/>
      <DashboardInfo/>
      <DashboardFooter/>
  </div>);
}

export default HomePage;
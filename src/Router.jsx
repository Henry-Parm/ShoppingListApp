import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import LandingPage from "./components/AuthComponents/LandingPage";
import { ListsProvider } from "./contexts/ListsContext";

const DashboardWithListsProvider = () => {
  return (
    <ListsProvider>
      <Dashboard />
    </ListsProvider>
  );
};

const Router = () => {
  return (
    <Routes>
      <Route exact path="/login" element={<LandingPage />} />
      <Route path="/" element={<DashboardWithListsProvider />} />
    </Routes>
  );
};

export default Router;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
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
      <Route exact path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardWithListsProvider />} />
    </Routes>
  );
};

export default Router;

import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { SubstrateProvider } from "./api/providers/connectProvider";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";

import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <SubstrateProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </SubstrateProvider>
    </AuthContextProvider>
  );
}

export default App;

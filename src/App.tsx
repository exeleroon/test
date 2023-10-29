import React from 'react';
import './App.css';
import TestApp from "./pages/home/Test-app";

function App() {
    type CellId = number; // unique value for all table
    type CellValue = number; // three digit random number

    type Cell = {
        id: CellId,
        amount: CellValue
    }
    
  return (
    <div className="App">
        <TestApp />
    </div>
  );
}

export default App;

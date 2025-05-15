import React from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
// import GanttChart from './components/GanttChart/GanttChart';
// import { mockData } from './mockData';

function App() {
  return (
    <div className="App">
      <Layout>
        <div className="app-content">
          {/* <GanttChart data={mockData} /> */}
        </div>
      </Layout>
    </div>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import GymList from './pages/GymList';
import GymDetail from './pages/GymDetail';
import TrainerList from './pages/TrainerList';
import TrainerDetail from './pages/TrainerDetail';
import TicketList from './pages/TicketList';
import MyPage from './pages/MyPage';
import CreateGoal from './pages/CreateGoal';
import GoalList from './pages/GoalList';
import GoalDetail from './pages/GoalDetail';
import OAuth2Success from './pages/OAuth2Success';
import OAuth2Failure from './pages/OAuth2Failure';
import OAuth2Test from './pages/OAuth2Test';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gyms" element={<GymList />} />
            <Route path="/gyms/:id" element={<GymDetail />} />
            <Route path="/trainers" element={<TrainerList />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/goals/create" element={<CreateGoal />} />
            <Route path="/goals" element={<GoalList />} />
            <Route path="/goals/:id" element={<GoalDetail />} />
            <Route path="/oauth2/success" element={<OAuth2Success />} />
            <Route path="/oauth2/failure" element={<OAuth2Failure />} />
            <Route path="/oauth2/test" element={<OAuth2Test />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
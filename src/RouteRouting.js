import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Tiles';
import App from './App';

// RouteRouting.js
const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/" element={<App />} />
      </Routes>
    </Router >
  );
};

export default Routing;
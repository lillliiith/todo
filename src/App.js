import './App.css';
import Welcome from "./components/welcome"
import Homepage from "./components/homepage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Conspects from './components/conspects';
import ContactMe from './components/ContactMe';

function App() {
  return (
    <div className="App">
     
      <Router>
        <Routes>
          <Route path='/' element={<Welcome/>} />
          <Route path='/homepage' element={<Homepage/>} />
          <Route path='/conspects' element ={<Conspects/>}/>
          <Route path='/ContactMe' element ={<ContactMe/>}/>
         
        </Routes>
      </Router>
    </div>
  );
}


export default App; 
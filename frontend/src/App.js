import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} 
from "react-router-dom";
import Fileupload from './components/uplaod';
import AllPages from './components/allpageview';
import View from './components/parent';

function App() {
  return (
      <>
          <Router>
          <Routes>
              <Route exact path='/' element={<View/>}/>
              <Route exact path='/summary' element={<AllPages/>}/>
          </Routes>
          </Router>
      </>
     
);
}

export default App;

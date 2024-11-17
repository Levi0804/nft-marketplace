
import { Landingpage } from './components/Landingpage'
import { NFTmarketplace } from './components/NFTmarketplace';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
 

  return (
    <div className='h-screen w-full'>
      <Router>
        <Routes>
          <Route  path="/" element={<Landingpage />}></Route>
          <Route path="/nftmarketplace" element={<NFTmarketplace/>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App

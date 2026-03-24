import { Routes,BrowserRouter, Route } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon'
import Register from './pages/Register'
import ThankYou from './pages/ThankYou'
import FooterWithMap from './components/commen/Footer'

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ComingSoon />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />

     
    </Routes>
    <FooterWithMap/>
    </BrowserRouter>
  )
}

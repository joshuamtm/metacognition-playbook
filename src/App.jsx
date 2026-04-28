import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Report from './Report.jsx'
import Reviewed from './Reviewed.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Report />} />
        <Route path="/reviewed" element={<Reviewed />} />
      </Routes>
    </BrowserRouter>
  )
}

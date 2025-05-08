import { Route, Routes } from 'react-router-dom'

import AuthChecker from '@/pages/AuthChecker'
import ErrorBoundary from '@/pages/ErrorBoundary'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthChecker private />} errorElement={<ErrorBoundary />}></Route>
      <Route path="/auth" element={<AuthChecker guest />} errorElement={<ErrorBoundary />}>
        <Routes>
          <Route path="/" element={<h1>dede</h1>} />
        </Routes>
      </Route>
      <Route element={<NotFound />} path="*" />
    </Routes>
  )
}

export default App

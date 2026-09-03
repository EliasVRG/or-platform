import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Students } from './pages/Students';
import { Enrollments } from './pages/Enrollments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/students" element={<Students />} />
          <Route path="/enrollments" element={<Enrollments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

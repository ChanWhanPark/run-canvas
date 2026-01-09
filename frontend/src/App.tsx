import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainPage } from './service/MainPage';
import { Settings } from './service/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [{ path: 'settings', element: <Settings /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

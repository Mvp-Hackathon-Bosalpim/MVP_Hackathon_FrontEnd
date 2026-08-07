import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MainLayout from "./components/layout/main-layout";
import DashboardPage from "./pages/dashboard/dashboard-page";
import NotFoundPage from "./pages/not-found-page";
import RegisterPage from "./pages/register-page";
import InboxPage from "./pages/inbox/inbox-page";
import InboxDetailPage from "./pages/inbox/inbox-detail-page";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/inbox", element: <InboxPage /> },
      { path: "/inbox/:docId", element: <InboxDetailPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

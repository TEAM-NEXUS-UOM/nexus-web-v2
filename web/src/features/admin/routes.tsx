// admin routes. Only the admin owner edits this file.
// Add <Route> elements inside the fragment, e.g.
// <Route path="/admin/dashboard" element={<Dashboard />} />

import { Route } from "react-router-dom";
import AdminList from "./pages/AdminList";

export const adminRoutes = (
  <>
    <Route path="/admin" element={<AdminList />} />
  </>
);
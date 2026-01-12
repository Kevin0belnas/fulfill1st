// import { Navigate, Outlet } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';

// export default function RoleRoute({ allowedRoles }) {
//   const { user, isAuthenticated } = useAuth();

//   if (isAuthenticated === null) return null; // or a loading spinner
//   console.log('Current role:', user?.role);
// console.log('Allowed roles:', allowedRoles);


//   if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return <Outlet />;
// }


// routes/RoleRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
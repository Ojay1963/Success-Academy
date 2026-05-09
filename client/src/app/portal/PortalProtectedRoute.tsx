import { Navigate, Outlet, useLocation } from "react-router";
import { portalRoleMeta, type PortalRole } from "../content/portal";
import { usePortalAuth } from "./AuthContext";
import { PortalLoadingScreen } from "./PortalComponents";

export default function PortalProtectedRoute({ role }: { role: PortalRole }) {
  const { isReady, user } = usePortalAuth();
  const location = useLocation();

  if (!isReady) {
    return <PortalLoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to={`/portal/login/${role}`}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (user.role !== role) {
    return <Navigate to={portalRoleMeta[user.role].defaultPath} replace />;
  }

  return <Outlet />;
}

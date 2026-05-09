import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import { usePortalAuth } from "./AuthContext";

export function usePortalResource<T>(path: string | null, requiresAuth = true) {
  const { token } = usePortalAuth();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(path));
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function run() {
      if (!path) {
        if (isMounted) {
          setData(null);
          setIsLoading(false);
          setError("");
        }
        return;
      }

      if (requiresAuth && !token) {
        if (isMounted) {
          setData(null);
          setIsLoading(false);
          setError("Authentication is required.");
        }
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const nextData = await apiRequest<T>(path, {}, token);
        if (isMounted) {
          setData(nextData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error ? requestError.message : "Unable to load data.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      isMounted = false;
    };
  }, [path, requiresAuth, token]);

  return { data, isLoading, error, setData };
}

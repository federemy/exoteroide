import React, { useMemo } from "react";
import { NEODetail } from "./NEODetail.jsx";
import { NEOList } from "./NEOList.jsx";
import { ExoplanetList } from "./ExoplanetList.jsx";

export function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  const view = useMemo(() => {
    // /neo/123456
    const m = path.match(/^\/neo\/(\d+)$/);
    if (m) {
      const id = m[1];
      return <NEODetail neoId={id} />;
    }

    // /exoplanetas
    if (path.startsWith("/exoplanetas")) {
      return <ExoplanetList />;
    }

    // Home (lista de NEOs, por ejemplo)
    return <NEOList />;
  }, [path]);

  return <>{view}</>;
}

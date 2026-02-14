import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TierListHomePage.css";

import { fetchTierLists } from "../api/tierlists.api";
import type { TierList } from "../types";

export default function TierListHomePage() {
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTierLists()
      .then(setTierLists)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2>Chargement...</h2>;

  return (
    <div className="tierlist-home">
      <h1>Tierlists</h1>

      {tierLists.length === 0 && <p>Aucune tierlist</p>}

      <ul className="tierlist-list">
        {tierLists.map(tl => (
          <li key={tl.id} className="tierlist-item">
            <Link to={`/tierlists/${tl.id}`}>
              <strong>{tl.name}</strong>
              <span>
                {new Date(tl.createdAt).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

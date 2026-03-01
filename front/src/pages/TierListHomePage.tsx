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

  if (loading) return (
    <div className="tierlist-home">
      <div className="title--principal">Chargement...</div>
    </div>);

  return (
    <div className="tierlist-home">
      <div className="title--principal">Tierlists</div>

      {tierLists.length === 0 && (
        <div className="tierlist-home-empty">
          Aucune tierlist pour le moment
        </div>
      )}

      <ul className="tierlist-home-list">
        {tierLists.map(tl => (
          <li key={tl.id}>
            <Link
              to={`/tierlists/${tl.id}`}
              className="tierlist-home-item card"
            >
              <span className="tierlist-home-name">
                {tl.name}
              </span>

              <span className="tierlist-home-date">
                {new Date(tl.updatedAt ?? tl.createdAt).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

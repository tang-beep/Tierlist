import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TierListHomePage.css";

import { fetchTierLists } from "../api/tierlists.api";
import type { TierList } from "../types";
import { useTranslation } from "../translations/useTranslation";

export default function TierListHomePage() {
  const [tierLists, setTierLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);

  const trans = useTranslation();

  useEffect(() => {
    fetchTierLists()
      .then(setTierLists)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="tierlist-home">
      <div className="title--principal"> {trans("common.loading")} </div>
    </div>);

  return (
    <div className="tierlist-home">
      <div className="title--principal"> {trans("common.TLs")} </div>

      {tierLists.length === 0 && (
        <div className="tierlist-home-empty">
          {trans("homePage.noTL")}
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

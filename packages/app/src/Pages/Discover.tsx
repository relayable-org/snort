import SuggestedProfiles from "Element/SuggestedProfiles";
import { Tab, TabElement } from "Element/Tabs";
import TrendingNotes from "Element/TrendingPosts";
import TrendingUsers from "Element/TrendingUsers";
import { useState } from "react";
import { useIntl } from "react-intl";

export default function Discover() {
  const { formatMessage } = useIntl();
  // tabs
  const Tabs = {
    Follows: { text: formatMessage({ defaultMessage: "Suggested Follows" }), value: 0 },
    Posts: { text: formatMessage({ defaultMessage: "Trending Notes" }), value: 1 },
    Profiles: { text: formatMessage({ defaultMessage: "Trending People" }), value: 2 },
  };
  const [tab, setTab] = useState<Tab>(Tabs.Follows);

  function renderTab() {
    switch (tab.value) {
      case 0:
        return <SuggestedProfiles />;
      case 1:
        return <TrendingNotes />;
      case 2:
        return <TrendingUsers />;
    }
    return null;
  }

  return (
    <>
      <div className="tabs">
        {[Tabs.Follows, Tabs.Posts, Tabs.Profiles].map(a => (
          <TabElement key={a.value} tab={tab} setTab={setTab} t={a} />
        ))}
      </div>
      {renderTab()}
    </>
  );
}

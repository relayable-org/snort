import "./Layout.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useUserProfile } from "@snort/system-react";

import messages from "./messages";

import Icon from "Icons/Icon";
import { RootState } from "State/Store";
import { setShow, reset } from "State/NoteCreator";
import { System } from "index";
import useLoginFeed from "Feed/LoginFeed";
import useModeration from "Hooks/useModeration";
import { NoteCreator } from "Element/NoteCreator";
import { mapPlanName } from "./subscribe";
import useLogin from "Hooks/useLogin";
import Avatar from "Element/Avatar";
import { profileLink } from "SnortUtils";
import { getCurrentSubscription } from "Subscription";
import Toaster from "Toaster";

export default function Layout() {
  const location = useLocation();
  const replyTo = useSelector((s: RootState) => s.noteCreator.replyTo);
  const isNoteCreatorShowing = useSelector((s: RootState) => s.noteCreator.show);
  const isReplyNoteCreatorShowing = replyTo && isNoteCreatorShowing;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publicKey, relays, preferences, subscriptions } = useLogin();
  const currentSubscription = getCurrentSubscription(subscriptions);
  const [pageClass, setPageClass] = useState("page");
  useLoginFeed();

  const handleNoteCreatorButtonClick = () => {
    if (replyTo) {
      dispatch(reset());
    }
    dispatch(setShow(true));
  };

  const shouldHideNoteCreator = useMemo(() => {
    const hideOn = ["/settings", "/messages", "/new", "/login", "/donate", "/p/", "/e", "/subscribe", "/live"];
    return isReplyNoteCreatorShowing || hideOn.some(a => location.pathname.startsWith(a));
  }, [location, isReplyNoteCreatorShowing]);

  const shouldHideHeader = useMemo(() => {
    const hideOn = ["/login", "/new"];
    return hideOn.some(a => location.pathname.startsWith(a));
  }, [location]);

  useEffect(() => {
    const widePage = ["/login", "/messages", "/live"];
    const noScroll = ["/messages", "/live"];
    if (widePage.some(a => location.pathname.startsWith(a))) {
      setPageClass(noScroll.some(a => location.pathname.startsWith(a)) ? "scroll-lock" : "");
    } else {
      setPageClass("page");
    }
  }, [location]);

  useEffect(() => {
    if (relays) {
      (async () => {
        for (const [k, v] of Object.entries(relays.item)) {
          await System.ConnectToRelay(k, v);
        }
        for (const v of System.Sockets) {
          if (!relays.item[v.address] && !v.ephemeral) {
            System.DisconnectRelay(v.address);
          }
        }
      })();
    }
  }, [relays]);

  function setTheme(theme: "light" | "dark") {
    const elm = document.documentElement;
    if (theme === "light" && !elm.classList.contains("light")) {
      elm.classList.add("light");
    } else if (theme === "dark" && elm.classList.contains("light")) {
      elm.classList.remove("light");
    }
  }

  useEffect(() => {
    const osTheme = window.matchMedia("(prefers-color-scheme: light)");
    setTheme(
      preferences.theme === "system" && osTheme.matches ? "light" : preferences.theme === "light" ? "light" : "dark"
    );

    osTheme.onchange = e => {
      if (preferences.theme === "system") {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    return () => {
      osTheme.onchange = null;
    };
  }, [preferences.theme]);

  return (
    <div className={pageClass}>
      {!shouldHideHeader && (
        <header className="main-content mt5">
          <div className="logo" onClick={() => navigate("/")}>
            <h1>nostr.AF</h1>
            {currentSubscription && (
              <small className="flex">
                <Icon name="diamond" size={10} className="mr5" />
                {mapPlanName(currentSubscription.type)}
              </small>
            )}
          </div>

          <div>
            {publicKey ? (
              <AccountHeader />
            ) : (
              <button type="button" onClick={() => navigate("/login")}>
                <FormattedMessage {...messages.Login} />
              </button>
            )}
          </div>
        </header>
      )}
      <Outlet />

      {!shouldHideNoteCreator && (
        <>
          <button className="note-create-button" onClick={handleNoteCreatorButtonClick}>
            <Icon name="plus" size={16} />
          </button>
          <NoteCreator />
        </>
      )}
      <Toaster />
    </div>
  );
}

const AccountHeader = () => {
  const navigate = useNavigate();

  const { publicKey, latestNotification, readNotifications } = useLogin();
  const profile = useUserProfile(System, publicKey);

  const hasNotifications = useMemo(
    () => latestNotification > readNotifications,
    [latestNotification, readNotifications]
  );
  const unreadDms = useMemo(() => (publicKey ? 0 : 0), [publicKey]);

  async function goToNotifications(e: React.MouseEvent) {
    e.stopPropagation();
    // request permissions to send notifications
    if ("Notification" in window) {
      try {
        if (Notification.permission !== "granted") {
          const res = await Notification.requestPermission();
          console.debug(res);
        }
      } catch (e) {
        console.error(e);
      }
    }
    navigate("/notifications");
  }

  return (
    <div className="header-actions">
      <div className="btn btn-rnd" onClick={() => navigate("/wallet")}>
        <Icon name="wallet" />
      </div>
      <div className="btn btn-rnd" onClick={() => navigate("/search")}>
        <Icon name="search" />
      </div>
      <div className="btn btn-rnd" onClick={() => navigate("/messages")}>
        <Icon name="envelope" />
        {unreadDms > 0 && <span className="has-unread"></span>}
      </div>
      <div className="btn btn-rnd" onClick={goToNotifications}>
        <Icon name="bell" />
        {hasNotifications && <span className="has-unread"></span>}
      </div>
      <Avatar
        user={profile}
        onClick={() => {
          if (profile) {
            navigate(profileLink(profile.pubkey));
          }
        }}
      />
    </div>
  );
};

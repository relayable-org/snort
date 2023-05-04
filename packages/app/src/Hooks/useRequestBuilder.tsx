import { useMemo, useSyncExternalStore } from "react";
import NDK, { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";

import { RequestBuilder, System } from "System";
import { EmptySnapshot, NoteStore, StoreSnapshot } from "System/NoteCollection";
import { unwrap } from "Util";
import useLogin from "./useLogin";
import { TaggedRawEvent } from "@snort/nostr";

const useRequestBuilder = <TStore extends NoteStore, TSnapshot = ReturnType<TStore["getSnapshotData"]>>(
  type: { new (): TStore },
  rb: RequestBuilder | null,
  debounced?: number
) => {
  const subscribe = (onChanged: () => void) => {
    const store = System.Query<TStore>(type, rb);
    let t: ReturnType<typeof setTimeout> | undefined;
    const release = store.hook(() => {
      if (!t) {
        t = setTimeout(() => {
          clearTimeout(t);
          t = undefined;
          onChanged();
        }, debounced ?? 500);
      }
    });

    return () => {
      if (rb?.id) {
        System.CancelQuery(rb.id);
      }
      release();
    };
  };
  const getState = (): StoreSnapshot<TSnapshot> => {
    if (rb?.id) {
      const q = System.GetQuery(rb.id);
      if (q) {
        return unwrap(q).feed?.snapshot as StoreSnapshot<TSnapshot>;
      }
    }
    return EmptySnapshot as StoreSnapshot<TSnapshot>;
  };
  return useSyncExternalStore<StoreSnapshot<TSnapshot>>(
    v => subscribe(v),
    () => getState()
  );
};

export const NostrNDK = new NDK({ explicitRelayUrls: ["wss://relay.snort.social"] });
NostrNDK.connect();

const useNDK = <TStore extends NoteStore, TSnapshot = ReturnType<TStore["getSnapshotData"]>>(
  type: { new (): TStore },
  rb: RequestBuilder | null
) => {
  const store = useMemo(() => {
    return new type();
  }, []);

  if (rb) {
    const sub = NostrNDK.subscribe({
      ...rb.build(),
    });
    sub.on("event", (ev, relay, forSub) => {
      if (forSub !== sub) return;
      store.add({
        ...(ev as NDKEvent).rawEvent(),
        relays: relay ? [relay.url] : [],
      } as TaggedRawEvent);
    });
    sub.start();

    return useSyncExternalStore<StoreSnapshot<TSnapshot>>(
      c => store.hook(c),
      () => store.snapshot as StoreSnapshot<TSnapshot>
    );
  }
  return EmptySnapshot as StoreSnapshot<TSnapshot>;
};
export default useNDK;

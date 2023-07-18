import { useMemo } from "react"
import { useRequestBuilder, useUserProfile } from "../src";

import { FlatNoteStore, NostrSystem, RequestBuilder, TaggedRawEvent } from "@snort/system"

const System = new NostrSystem({});

// some bootstrap relays
[
    "wss://relayable.org",
    "wss://pleb.cloud"
].forEach(r => System.ConnectToRelay(r, { read: true, write: false }));

export function Note({ ev }: { ev: TaggedRawEvent }) {
    const profile = useUserProfile(System, ev.pubkey);

    return <div>
        Post by: {profile.name ?? profile.display_name}
        <p>
            {ev.content}
        </p>
    </div>
}

export function UserPosts(props: { pubkey: string }) {
    const sub = useMemo(() => {
        const rb = new RequestBuilder("get-posts");
        rb.withFilter()
            .authors([props.pubkey])
            .kinds([1])
            .limit(10);

        return rb;
    }, [props.pubkey]);

    const data = useRequestBuilder<FlatNoteStore>(System, FlatNoteStore, sub);
    return (
        <>
            {data.data.map(a => <Note ev={a} />)}
        </>
    )
}

export function MyApp() {
    return (
        <UserPosts pubkey="63fe6318dc58583cfe16810f86dd09e18bfd76aabc24a0081ce2856f330504ed" />
    )
}

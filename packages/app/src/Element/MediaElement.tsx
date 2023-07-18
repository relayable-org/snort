import { ProxyImg } from "Element/ProxyImg";
import React, { MouseEvent, useEffect, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Link } from "react-router-dom";
import { decodeInvoice, InvoiceDetails } from "@snort/shared";

import "./MediaElement.css";
import Modal from "Element/Modal";
import Icon from "Icons/Icon";
import { kvToObject } from "SnortUtils";
import AsyncButton from "Element/AsyncButton";
import { useWallet } from "Wallet";
import { PaymentsCache } from "Cache";
import { Payment } from "Db";
import PageSpinner from "Element/PageSpinner";

/*
[
  "imeta",
  "url https://nostr.build/i/148e3e8cbe29ae268b0d6aad0065a086319d3c3b1fdf8b89f1e2327d973d2d05.jpg",
  "blurhash e6A0%UE2t6D*R%?u?a9G?aM|~pM|%LR*RjR-%2NG%2t7_2R*%1IVWB",
  "dim 3024x4032"
],
*/
interface MediaElementProps {
  mime: string;
  url: string;
  magnet?: string;
  sha256?: string;
  blurHash?: string;
  disableSpotlight?: boolean;
}

interface L402Object {
  macaroon: string;
  invoice: string;
}

export function MediaElement(props: MediaElementProps) {
  const [invoice, setInvoice] = useState<InvoiceDetails>();
  const [l402, setL402] = useState<L402Object>();
  const [auth, setAuth] = useState<Payment>();
  const [error, setError] = useState("");
  const [url, setUrl] = useState(props.url);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  async function probeFor402() {
    const cached = await PaymentsCache.get(props.url);
    if (cached) {
      setAuth(cached);
      return;
    }

    try {
      const req = new Request(props.url, {
        method: "OPTIONS",
        headers: {
          accept: "L402",
        },
      });
      const rsp = await fetch(req);
      if (rsp.status === 402) {
        const auth = rsp.headers.get("www-authenticate");
        if (auth?.startsWith("L402")) {
          const vals = kvToObject<L402Object>(auth.substring(5));
          console.debug(vals);
          setL402(vals);

          if (vals.invoice) {
            const decoded = decodeInvoice(vals.invoice);
            setInvoice(decoded);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function payInvoice() {
    if (wallet.wallet && l402) {
      try {
        const res = await wallet.wallet.payInvoice(l402.invoice);
        console.debug(res);
        if (res.preimage) {
          const pmt = {
            pr: l402.invoice,
            url: props.url,
            macaroon: l402.macaroon,
            preimage: res.preimage,
          };
          await PaymentsCache.set(pmt);
          setAuth(pmt);
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
  }

  async function loadMedia() {
    if (!auth) return;
    setLoading(true);

    const mediaReq = new Request(props.url, {
      headers: {
        Authorization: `L402 ${auth.macaroon}:${auth.preimage}`,
      },
    });
    const rsp = await fetch(mediaReq);
    if (rsp.ok) {
      const buf = await rsp.blob();
      setUrl(URL.createObjectURL(buf));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (auth) {
      loadMedia().catch(console.error);
    }
  }, [auth]);

  if (auth && loading) {
    return <PageSpinner />;
  }

  if (invoice) {
    return (
      <div className="note-invoice">
        <h3>
          <FormattedMessage defaultMessage="Payment Required" />
        </h3>
        <div className="flex f-row">
          <div className="f-grow">
            <FormattedMessage
              defaultMessage="You must pay {n} sats to access this file."
              values={{
                n: <FormattedNumber value={(invoice.amount ?? 0) / 1000} />,
              }}
            />
          </div>
          <div>
            {wallet.wallet && (
              <AsyncButton onClick={() => payInvoice()}>
                <FormattedMessage defaultMessage="Pay Now" />
              </AsyncButton>
            )}
          </div>
        </div>
        {!wallet.wallet && (
          <b>
            <FormattedMessage
              defaultMessage="Please connect a wallet {here} to be able to pay this invoice"
              values={{
                here: (
                  <Link to="/settings/wallet" onClick={e => e.stopPropagation()}>
                    <FormattedMessage defaultMessage="here" description="Inline link text pointing to another page" />
                  </Link>
                ),
              }}
            />
          </b>
        )}
        {error && <b className="error">{error}</b>}
      </div>
    );
  }

  if (props.mime.startsWith("image/")) {
    if (!(props.disableSpotlight ?? false)) {
      return (
        <SpotlightMedia>
          <ProxyImg key={props.url} src={url} onError={() => probeFor402()} />
        </SpotlightMedia>
      );
    } else {
      return <ProxyImg key={props.url} src={url} onError={() => probeFor402()} />;
    }
  } else if (props.mime.startsWith("audio/")) {
    return <audio key={props.url} src={url} controls onError={() => probeFor402()} />;
  } else if (props.mime.startsWith("video/")) {
    return <video key={props.url} src={url} controls onError={() => probeFor402()} />;
  } else {
    return (
      <a
        key={props.url}
        href={props.url}
        onClick={e => e.stopPropagation()}
        target="_blank"
        rel="noreferrer"
        className="ext">
        {props.url}
      </a>
    );
  }
}

export function SpotlightMedia({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  function onClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(s => !s);
  }

  function onClose(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal onClose={onClose} className="spotlight">
          <div className="close" onClick={onClose}>
            <Icon name="close" />
          </div>
          {children}
        </Modal>
      )}
      <div onClick={onClick}>{children}</div>
    </>
  );
}

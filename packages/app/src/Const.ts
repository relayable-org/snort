import { RelaySettings } from "@snort/system";

/**
 * Add-on api for snort features
 */
export const ApiHost = "https://api.snort.social";

/**
 * LibreTranslate endpoint
 */
export const TranslateHost = "https://translate.snort.social";

/**
 * Void.cat file upload service url
 */
export const VoidCatHost = "https://void.cat";

/**
 * Kierans pubkey
 */
export const KieranPubKey = "npub1v0lxxxxutpvrelsksy8cdhgfux9l6a42hsj2qzquu2zk7vc9qnkszrqj49";

/**
 * Official snort account
 */
export const SnortPubKey = "npub1sn0rtcjcf543gj4wsg7fa59s700d5ztys5ctj0g69g2x6802npjqhjjtws";

/**
 * Websocket re-connect timeout
 */
export const DefaultConnectTimeout = 2000;

/**
 * How long profile cache should be considered valid for
 */
export const ProfileCacheExpire = 1_000 * 60 * 60 * 6;

/**
 * Default bootstrap relays
 */
export const DefaultRelays = new Map<string, RelaySettings>([
  ["wss://relayable.org/", { read: true, write: true }],
]);

/**
 * Default search relays
 */
export const SearchRelays = ["wss://relay.nostr.band"];

/**
 * List of recommended follows for new users
 */
export const RecommendedFollows = [
  "d2704392769c20d67a153fa77a8557ab071ef27aafc29cf6b46faf582e0595f2", // relayable
  "2479739594ed5802a96703e5a870b515d986982474a71feae180e8ecffa302c6", // jascha
  "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2", // jack
  "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d", // fiatjaf
  "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93", // gigi
  "63fe6318dc58583cfe16810f86dd09e18bfd76aabc24a0081ce2856f330504ed", // Kieran
  "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245", // jb55
  "e33fe65f1fde44c6dc17eeb38fdad0fceaf1cae8722084332ed1e32496291d42", // wiz
  "00000000827ffaa94bfea288c3dfce4422c794fbb96625b6b31e9049f729d700", // cameri
  "E88A691E98D9987C964521DFF60025F60700378A4879180DCBBB4A5027850411", // NVK
  "C4EABAE1BE3CF657BC1855EE05E69DE9F059CB7A059227168B80B89761CBC4E0", // jackmallers
  "85080D3BAD70CCDCD7F74C29A44F55BB85CBCD3DD0CBB957DA1D215BDB931204", // preston
  "3F770D65D3A764A9C5CB503AE123E62EC7598AD035D836E2A810F3877A745B24", // DerekRoss
  "472F440F29EF996E92A186B8D320FF180C855903882E59D50DE1B8BD5669301E", // MartyBent
  "1577e4599dd10c863498fe3c20bd82aafaf829a595ce83c5cf8ac3463531b09b", // yegorpetrov
  "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9", // ODELL
  "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194", // verbiricha
];

/**
 * Snort imgproxy details
 */
export const DefaultImgProxy = {
  url: "https://imgproxy.snort.social",
  key: "a82fcf26aa0ccb55dfc6b4bd6a1c90744d3be0f38429f21a8828b43449ce7cebe6bdc2b09a827311bef37b18ce35cb1e6b1c60387a254541afa9e5b4264ae942",
  salt: "a897770d9abf163de055e9617891214e75a9016d748f8ef865e6ffbcb9ed932295659549773a22a019a5f06d0b440c320be411e3fddfe784e199e4f03d74bd9b",
};

/**
 * NIP06-defined derivation path for private keys
 */
export const DerivationPath = "m/44'/1237'/0'/0/0";

/**
 * Regex to match email address
 */
export const EmailRegex =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Regex to match a mnemonic seed
 */
export const MnemonicRegex = /(\w+)/g;

/**
 * Extract file extensions regex
 */
// eslint-disable-next-line no-useless-escape
export const FileExtensionRegex = /\.([\w]{1,7})$/i;

/**
 * Extract note reactions regex
 */
export const MentionRegex = /(#\[\d+\])/gi;

/**
 * Simple lightning invoice regex
 */
export const InvoiceRegex = /(lnbc\w+)/i;

/**
 * YouTube URL regex
 */
export const YoutubeUrlRegex =
  /(?:https?:\/\/)?(?:www|m\.)?(?:youtu\.be\/|youtube\.com\/(?:live\/|shorts\/|embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

/**
 * Tweet Regex
 */
export const TweetUrlRegex = /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;

/**
 * Hashtag regex
 */
// eslint-disable-next-line no-useless-escape
export const HashtagRegex = /(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+)/g;

/**
 * Tidal share link regex
 */
export const TidalRegex = /tidal\.com\/(?:browse\/)?(\w+)\/([a-z0-9-]+)/i;

/**
 * SoundCloud regex
 */
export const SoundCloudRegex = /soundcloud\.com\/(?!live)([a-zA-Z0-9]+)\/([a-zA-Z0-9-]+)/;

/**
 * Mixcloud regex
 */
export const MixCloudRegex = /mixcloud\.com\/(?!live)([a-zA-Z0-9]+)\/([a-zA-Z0-9-]+)/;

/**
 * Spotify embed regex
 */
export const SpotifyRegex = /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/;

/**
 * Twitch embed regex
 */
export const TwitchRegex = /twitch.tv\/([a-z0-9_]+$)/i;

/**
 * Apple Music embed regex
 */
export const AppleMusicRegex =
  /music\.apple\.com\/([a-z]{2}\/)?(?:album|playlist)\/[\w\d-]+\/([.a-zA-Z0-9-]+)(?:\?i=\d+)?/i;

/**
 * Nostr Nests embed regex
 */
export const NostrNestsRegex = /nostrnests\.com\/[a-zA-Z0-9]+/i;

/*
 * Magnet link parser
 */
export const MagnetRegex = /(magnet:[\S]+)/i;

/**
 * Wavlake embed regex
 */
export const WavlakeRegex =
  /https?:\/\/(?:player\.|www\.)?wavlake\.com\/(?!top|new|artists|account|activity|login|preferences|feed|profile)(?:(?:track|album)\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}|[a-z-]+)/i;

/*
 * Regex to match any base64 string
 */
export const CashuRegex = /(cashuA[A-Za-z0-9_-]{0,10000}={0,3})/i;

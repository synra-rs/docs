---
title: Building a UI
---

# Building a UI

A plugin's interface is a WebView bundle the kernel loads into a separated context and gives a client object.
The client is the whole of what the page can reach — there is no `window.synra`, no filesystem, and no network
except through what the plugin declared.

## The two kinds of plugin

| Runtime | What the kernel loads | What the plugin can do |
| --- | --- | --- |
| `runtime.headless` | a WebAssembly component | everything the SDK exposes |
| `runtime.ui` | a WebView bundle | only what the injected client exposes |
| both | both, sharing one manifest | both, talking to each other through the kernel |

::: info Why a UI-only plugin is safer rather than merely simpler
The kernel runs no code from it. Everything it does goes through the client, and every client call is one the
kernel can attribute, rate-limit and refuse. A UI plugin cannot outlive the page it lives in.
:::

## The injected client

A plugin's page reaches the host through a single global object, present before the page's own code runs.

| Namespace | For |
| --- | --- |
| `env` | facts about the environment: SDK version, locale, dark mode |
| `log` | writing to the log |
| `event` | emitting and subscribing |
| `device` | listing devices, and reaching one |
| `storage` | the plugin's own saved data |
| `network` | requests the plugin declared |
| `transfer` | sending and receiving files |
| `platform` | the operating system |
| `clipboard` | reading and writing it |
| `self` | invoking the plugin's own actions |

Every method is a call, so it returns a promise. Nothing is synchronous — a synchronous call would be one that
blocks the page on the kernel.

::: warning The client is not a browser API
There is no `fetch` global and no filesystem. A page that used one would fail in the WebView, and the failure
would look like a bug in the plugin rather than a refusal by the host.
:::

## Declaring the pages

A UI plugin declares its pages in the manifest, and the kernel serves them from the bundle.

- The **entry** is the HTML file the WebView loads.
- The **default page** is where the user lands when they open the plugin.
- Each **page** is a route the plugin makes reachable.

## Capabilities and the interface

The interface's calls are checked exactly as a headless plugin's are. A page that calls something the manifest
does not declare gets `capability_denied`, and the user never sees a prompt about it.

::: tip Ask for less, and the install prompt says more
`network:fetch:api.example.com` and `network:fetch:*` are one word apart in a manifest and very different in a
prompt. The narrow one tells the user which server sees their data.
:::

## Styling

The page is its own document in its own origin. The host's stylesheets do not reach it, and its styles do not
reach the host — which also means a CSS reset here cannot leak into the rest of the application.

### What the page may load

Everything the page shows comes from the bundle. It has no network of its own, so a request to a font service,
an icon CDN or an image host is a request that fails — and it fails quietly.

| You want | What to do |
| --- | --- |
| A web font | Bundle the font file and serve it from the package: `font-src` is `self` |
| An icon set | Bundle the icons at build time; fetching one at runtime renders an empty box |
| A remote image | Bundle it, or fetch it through `synra.network` and render the response |
| `fetch()` | `synra.network.fetch` — the only network the page has |
| An inline style | Fine: `style-src` allows `unsafe-inline` |

::: warning The failure mode is not an error
A font that cannot be fetched falls back to the system stack, and an icon that cannot be fetched renders as an
empty square. Neither looks like a refusal by the host, so both get reported as a bug in the plugin. Declare
what you need, or bundle it.
:::

### Theme

`env` reports the environment, including whether the interface is in dark mode. The host does not style your
page, so the page applies that itself: set the theme on your own root element and drive the colours from it.

### Text direction and language

`env` carries the locale as well. Write your CSS with logical properties (`margin-inline-start`, not
`margin-left`) so a right-to-left locale does not need a second stylesheet, and keep text out of images.

## Next

- [The Manifest](/plugins/manifest) — how to declare pages and the runtime.
- [Capabilities](/reference/capabilities) — what each declaration means to a user.
- [Publishing](/plugins/publishing) — signing a bundle whose UI and code ship together.

---
title: Building a UI
---

# Building a UI

A hybrid plugin's page is its own document. It reaches the host through the injected client
and invokes business logic in its own component.

## Client types

Install `@synra/client` as a development dependency and enable the global declarations:

```json
{
  "compilerOptions": {
    "types": ["@synra/client"]
  }
}
```

The package contains types, not a connection runtime. The host injects `window.synra` before page
scripts run. A standalone browser needs a separate test environment.

## Client surface

| Namespace | Purpose |
| --- | --- |
| `env` | Host version, kind, locale, theme, grants and feature support |
| `log` | Diagnostic messages |
| `event` | JavaScript event emission and subscriptions |
| `device` | Device list, changes and declared device operations |
| `storage` | Namespaced local storage |
| `network` | Host-mediated HTTP |
| `transfer` | Transfer calls and status |
| `platform` / `clipboard` | Supported platform effects |
| `self` | Calls to this plugin's declared actions |

Remote `device.send` / `broadcast` and the host picker are present in types but explicitly unsupported
by the current injected implementation. Build your own selection from `device.list`;
do not infer remote execution support from a method's existence.

Most operations return promises. Environment checks and helpers such as `ready()` and
`requestId()` are synchronous; follow the actual type signatures.

## Check three different conditions

| Query | Answers |
| --- | --- |
| `env.can` | Does this plugin have the grant? |
| `env.platformSupports` | Does this platform expose the capability? |
| `env.hostSupports` | Does this host implement the client feature? |

Check the relevant condition and still handle failure at execution.
A page cannot approve its own host-level consent dialog.

## Load and style the page

Declare the HTML entry under `runtime.ui`. Bundle scripts, fonts, icons and styles, using relative
asset paths. The host's Content Security Policy restricts browser network access; browser `fetch`
still exists as an API, but it is not a bypass for declared HTTP access.

Use `synra.network.fetch` for host-mediated requests and handle its typed response.
Apply locale and theme to your own document; host styles do not leak into it.
The optional `@synra/theme` adapters provide shared tokens without moving business UI into the host.

## Navigation and lifecycle

The host opens an independent desktop window or Android `PluginActivity`.
Android provides its own return bar and system Back outside your document.

Stop subscriptions and plugin-owned work when leaving, hiding or replacing the page.
Ignore late responses from an earlier target or request. Provide waiting, refusal, error and retry
states as well as success, and keep destructive decisions with their actual owner.

## Next

- [The Manifest](/plugins/manifest).
- [Testing](/plugins/testing).
- [Platform Support](/reference/platform-matrix).

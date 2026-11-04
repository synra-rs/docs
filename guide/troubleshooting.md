---
title: Troubleshooting
---

# Troubleshooting

First identify the failing stage: discovery, connection, pairing, plugin approval or the operation itself.

## Start with the host

Keep both hosts running, bring mobile Synra to the foreground, and open the host's console or
diagnostics. Record both sides' versions and logs around the same operation.

If using the source CLI, its local diagnostic is also available:

```sh
synra doctor
synra --output json doctor
```

A successful local diagnostic does not establish peer connectivity or native plugin effects.

## Devices cannot see each other

1. Confirm the same reachable network. Guest Wi-Fi isolation and VPN routes may separate devices.
2. Allow Synra through the firewall for UDP discovery and TCP connections.
3. Scan from both sides. Compare query and received-announcement logs.
4. Check active network interfaces and the receiving app's foreground state.

| Log or result | Establishes |
| --- | --- |
| `lan query` | A discovery query was sent |
| `lan heard address:port` | An announcement with a TCP listening endpoint was received |
| TCP connection established | That endpoint accepted a connection |
| Plugin task succeeded | The relevant business operation completed |

::: info Discovery is not a connection test
A `lan heard` line does not prove that the announced TCP port is reachable.
The UDP reply endpoint and the advertised TCP listening endpoint have different roles.
:::

## Ports and connection refusal

UDP discovery defaults to **32101**. The application's TCP listening port is chosen at startup and
advertised to peers; the daemon defaults to **47100** and has its own command-line options.

Use the current announcement and allow the application through the firewall rather than relying on
a fixed app TCP port. A peer's temporary connection source port is not its listening port.

Connection refusal, including Windows error **10061**, means the TCP connection was refused.
Check the target's running listener and current endpoint. Update both hosts if an old build keeps
using the endpoint saved at pairing.

## Pairing does not finish

Both devices must keep the same code visible until the receiver decides or the request ends.
Check for refusal, cancellation, blocking and timeout. Forget stale local decisions only when
you intend to pair again.

A code that flashes while the other host already shows paired is not normal completion.
Use current builds on both sides and compare their logs.

## Plugin permissions or pages

- “No permissions required” with pending confirmation needs **Allow running**.
- A listed capability still needs approval; approval does not enable a disabled plugin.
- A receiving device may need the same plugin and a separate request confirmation.
- Use Android's native return bar if a plugin page cannot navigate back.
- If an overlay prevents further actions, reproduce from a fresh host and include the
  detail → sync → console sequence in the report.

## Updates and registry installs

- A registry install needs a configured source. An empty list turns the feature off; it is not a failure.
- **Check for updates** reports a version only while the configured registry still publishes that plugin.
- An automatic update that asks for new permissions is never installed in the background; it waits for you.
- A package signed with a key marked **Not reviewed** still needs a decision. Trust is per key, not per name.
- A scheduled check is a courtesy request. No network, no registry and a removed package all look
  the same from there, so the manual check is where a refusal is named.

## Report a problem

Include the host and plugin versions, OS or Android compatibility environment, operation steps,
first error and both hosts' nearby logs. Avoid including file contents, tokens or signing keys.

## Next

- [Devices & Pairing](/guide/devices-and-pairing).
- [Data Locations](/reference/paths).
- [Platform Support](/reference/platform-matrix).

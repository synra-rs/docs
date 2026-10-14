---
title: Troubleshooting
---

# Troubleshooting

Most problems are one of three things: the two devices cannot see each other, they are not paired, or something
the kernel needs is missing. `synra doctor` answers the third directly and narrows the first two.

## Start with the diagnostic

```bash
synra doctor
```

It probes the machine rather than the network, and each result is one of three:

| Result | Means |
| --- | --- |
| ok | the probe ran and the answer was good |
| warn | the probe could not run, or found something not fatal |
| fail | the kernel cannot run here until this is fixed |

`--failures-only` prints just the failures, and `--output json` prints one JSON value for a report.

::: tip Include the report when asking for help
`--output json` is designed to be pasted. It says which platform, which directories, and which probes could not
run — the three things a person helping you would otherwise have to ask for.
:::

## What each probe means

| Probe | If it fails |
| --- | --- |
| `tcp_port_available` | something else holds the transport port |
| `discovery_port_available` | something else holds the discovery port |
| `discovery_udp_available` | multicast discovery cannot bind |
| `network_stack` | the machine cannot open a socket at all |
| `firewall` | the platform wants a rule added |
| `data_dir_writable` | the data directory is not writable by this user |
| `disk_space` | the data directory refuses writes |
| `clock_sanity` | the system clock is far enough off to break pairing |
| `webview_version` | no WebView is available, so the window will not open |
| `keyring` | the keychain was not reachable |
| `wasm_backend` | the plugin runtime did not initialise |
| `plugin_dir` | the plugins directory does not exist yet |

::: warning A `warn` about the keyring or the Wasm backend is not a pass
It means the probe did not run, usually because it needs something this command cannot start. It is reported
rather than skipped so the gap is visible.
:::

## The two devices cannot see each other

In order:

1. **Same network.** Discovery is local. A VPN on one device can put it on a different one.
2. **The firewall.** `synra doctor`'s `firewall` probe says whether this platform wants a rule. Two things need
   inbound traffic allowed, and they are separate: **UDP 32101**, which is how devices find each other, and
   **TCP 47100**, which is how they actually talk. A rule that allows only the first gives you the worst case —
   devices that appear in the list and cannot be connected to.
3. **Client isolation.** Some guest networks block traffic between clients, and no setting on the device fixes
   it.

## Ports

Two ports matter, and a device needs something different from each.

| Port | Protocol | Direction | What it is for |
| --- | --- | --- | --- |
| 32101 | UDP | inbound and outbound | discovery: broadcasts and their answers |
| 47100 | TCP | inbound and outbound | the transport: one connection per peer, carrying messages |

**32101 is fixed.** It is the protocol's own constant, and it has to be the same on every device — a device that
listened somewhere else could not be found, and could not find anything. It is also a **singleton per machine**:
two kernels on one host would both answer every query, and a peer would receive two answers from one address with
different device identifiers. `--discovery-port` moves it, and both devices have to agree if you do.

**47100 is the port peers connect to**, and it is the one that matters most for a firewall rule. `--listen-port`
changes it, and the announcement a device broadcasts carries whatever it was set to — so two devices can use
different ports and still reach each other.

::: tip The outbound query port is not one of these
This device's own discovery queries go out from an **ephemeral** port the operating system assigns, so that the
answers come back to a socket that is not the shared one. It is not a setting, it changes between runs, and it
needs no firewall rule. Nothing else in Synra uses a port you have not seen in the table above.
:::

## They can see each other and not pair

- **The prompt was refused.** A refusal carries a reason: `busy`, `expired`, or `blocked`. `expired` is the one
  to retry; `blocked` needs unblocking on the other device.
- **The clock is far off.** Pairing involves a timestamp, and a device whose clock is minutes out can be
  refused as expired immediately. The `clock_sanity` probe catches this.

## A transfer stops

An interrupted transfer resumes by itself when the link comes back, within the total time budget. A cancelled
one does not.

The failure to look for is `integrity_mismatch`: the received bytes did not match the digest declared before
they were sent. The partial file is discarded and a retry starts again. See [Error Codes](/reference/errors).

## Where the logs are

`synra logs` reads the kernel's log. The files are under the cache directory — see
[Data Locations](/reference/paths) for the per-platform paths.

::: warning A diagnostic bundle does not include your keys
It carries the logs, the crash reports and the doctor report. It does not carry the data directory's keys, which
is what makes it safe to send.
:::

## Next

- [Data Locations](/reference/paths) — where everything is on disk.
- [Error Codes](/reference/errors) — what a specific code means.
- [Platform Support](/reference/platform-matrix) — what differs per platform.

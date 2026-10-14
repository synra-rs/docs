---
title: Platform Support
---

# Platform Support

Synra runs wherever the application shell runs. This page says which platforms those are, and how the
differences between them show up rather than being flattened into a promise.

## What ships

| Platform | Status |
| --- | --- |
| Windows | supported |
| macOS | supported |
| Linux | supported |
| Android | supported |
| iOS | supported |

The three desktop platforms differ in packaging and in where data lives, not in what the kernel does. See
[Data Locations](/reference/paths) for the per-platform directories.

## How a difference is reported

Some things a plugin may ask for do not exist on every platform. Simulating a keystroke does not exist on
iOS; a notification facility may be absent on a headless Linux machine.

::: info The kernel does not carry a table of platform abilities
The application shell implements the platform layer, and the kernel asks it. That means the answer comes from
the machine actually running rather than from a list compiled into the kernel — which is the only way it can
be right for a Linux machine with no notification daemon.
:::

A call for something the machine cannot do fails with `unsupported`, and the action that would have been
taken is not taken.

::: warning `unsupported` is not a bug report
It means the platform cannot do this, not that something went wrong. An interface that showed it as an error
would be telling the user to retry something that will never work.
:::

## What is the same everywhere

- **The wire protocol.** Two devices running different platforms interoperate, which is the point of having
  one protocol rather than a per-platform one.
- **The capability model.** A plugin's declaration means the same thing on every platform.
- **The storage layout's shape.** The directories exist everywhere; only their parents differ.

## Mobile

Android and iOS are supported for the interface and for receiving transfers. Two differences are worth
knowing before writing a plugin for them:

| Difference | Consequence |
| --- | --- |
| no always-on background process | a transfer may be interrupted by the system and resumed later |
| a keystroke simulator does not exist | `platform:simulate-keys` reports `unsupported` |

::: tip A plugin that works on desktop is not automatically a mobile plugin
The kernel is the same, so a plugin that only listens for events needs no changes. A plugin that drives the
desktop — sending keystrokes, revealing a file location — is one whose calls a mobile build will refuse.
:::

---
title: Tasks & Transfers
---

# Tasks & Transfers

The host provides transport and generic task controls. A plugin decides what content to send and
what a completed operation means. There is no host setting that turns on universal clipboard mirroring.

## Starting a task

Start feature-specific work from its plugin page. The host may display the target, progress,
confirmation and result. Plugin synchronization is available in plugin management.

A request being queued or bytes being sent is not the same as a successful action on the receiver.
Wait for the relevant task result.

## Receiving files

| Stage | Receiver behavior |
| --- | --- |
| Offer | Inspect metadata and any required user decision |
| Transfer | Receive bounded chunks into temporary storage |
| Check | Verify size and digest |
| Commit | Place the completed file and report the result |

The receiver can accept or refuse a transfer. Remembered sender preferences are managed in settings;
forgetting a device also removes its associated receiving trust.

::: tip Wait for completion
A visible progress row is not a completed file. Use the completed task's location rather than
guessing a path from the sender's filename.
:::

## Cancellation and interruption

Cancel ends the current task and cleans up its incomplete receive state.
A disconnected operation may fail or require a new request: this release does not promise automatic
pause-and-resume after any network or mobile background interruption.

Inspect the result before retrying, especially for actions with effects that should occur only once.

## Clipboard workflows

Clipboard reading, writing and remote content behavior depend on the plugin and platform support.
Transferring text does not itself mean it was pasted or copied on the other device.
There is no built-in **Settings → Clipboard** switch.

## Where data goes

The host uses its private data directory and inbox for received artifacts. See
[Data Locations](/reference/paths) and the completed task for the actual location.

## Next

- [Plugins](/guide/plugins).
- [Error Codes](/reference/errors).
- [Troubleshooting](/guide/troubleshooting).

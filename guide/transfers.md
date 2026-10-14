---
title: Clipboard & Files
---

# Clipboard & Files

Two things can move between paired devices: text, and files. They are the same mechanism with different payloads,
and the differences that matter are in how each one finishes.

## Text

Text is sent inline when it is small enough, and as a transfer when it is not. The threshold is the kernel's, and
a long paste crossing it is not something you have to think about.

::: info Why text is not always inline
An inline message is carried in one envelope and has to fit in one frame. A 2 MB paste does not, and a kernel
that tried would either refuse it or hold a frame buffer open for something that is really a file.
:::

## Files

A file transfer is resumable. Each block that arrives is recorded, so an interrupted transfer continues from
where it stopped rather than starting again.

| Step | What happens |
| --- | --- |
| the offer | the sender says what it is, how big, and its digest |
| the blocks | the file arrives in chunks, each recorded as it lands |
| the check | the received bytes are compared against the declared digest |
| the finish | the file is moved into place, and only then does it appear |

::: warning The digest is declared before the bytes are sent
That is what makes a mismatch meaningful: it says what arrived is not what was promised, rather than that
something changed in transit. A file that fails the check is discarded rather than kept, and a retry starts
again.
:::

::: tip A file appears when it is complete
Not while it arrives. A half-written file with the final name is one a user can open, and the application that
opened it has no way to know it was early.
:::

## Pausing and resuming

A transfer that stops — the device went to sleep, the network changed, you closed the lid — does not fail. It
waits, and continues when the link comes back, as long as the total time budget has not run out.

A transfer that is cancelled is not resumed.

## Where a received file goes

Into the folder you chose, or the default download location. The kernel writes it and the receiving end decides
where it lands.

## Clipboard sync

When a plugin shares the clipboard, what arrives is an ordinary event with the text in it. There is no automatic
clipboard mirroring: a plugin decides whether to make it a notification, a paste, or nothing.

::: warning Clipboard sync is a plugin's decision, not a setting
The kernel carries the text; whether it lands in your clipboard is up to what you installed. That is deliberate —
a kernel that pasted into your clipboard would be one that could put a password there.
:::

## Next

- [Devices & Pairing](/guide/devices-and-pairing) — what has to be true before anything can be sent.
- [Troubleshooting](/guide/troubleshooting) — when a transfer does not finish.
- [Error Codes](/reference/errors) — what a failure is telling you.

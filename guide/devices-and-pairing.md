---
title: Devices & Pairing
---

# Devices & Pairing

Pairing is the one decision Synra asks you to make. Once two devices are paired they can send to each other
without asking again; nothing that is not paired can send anything to you.

## Seeing and being seen

A device announces itself on the local network and can be seen before it is paired. Being visible is not being
trusted — the two are separate, and the device list distinguishes them.

| State | Means |
| --- | --- |
| seen | the device announced itself; you can see it and not send to it |
| paired | it can send to you and you to it |
| online | it answered recently |
| blocked | it cannot reach you, whatever state the rest is in |

::: info Why "seen" and "paired" are different
A list that mixed them would show a device in your kitchen as available. The two answer different questions:
paired-but-offline is one you can send to later, and online-but-unpaired is one you have to pair with first.
:::

## How pairing goes

1. One device asks to pair. The request carries the asking device's name, so the other end shows a name rather
   than an identifier.
2. The other device shows a prompt, and someone has to accept it. Nothing pairs without that.
3. Both ends then hold a secret. It is not sent again, and it cannot be derived from anything that went over the
   network.

::: tip The prompt shows a name, not an address
`Lena's laptop` is a decision you can make. An address is not, which is why the request carries a profile rather
than a socket.
:::

## Why a request can be refused

| Refusal | Means | What to do |
| --- | --- | --- |
| busy | the other device is in the middle of something | try again in a moment |
| expired | nobody answered in time | ask again |
| blocked | that device is blocked on this one | unblock it first |

A refusal is a decision rather than a failure: the request reached the other device and was answered.

## Blocking

Blocking a device stops it reaching you whatever else is true — paired, online, or mid-transfer. It is the one
state that overrides the others, which is why it is separate from unpairing.

::: warning Unpairing and blocking are not the same
Unpairing removes the shared secret, so neither side can send to the other. Blocking keeps the secret and stops
the traffic. If you might want the device back, blocking is the one that is easy to undo.
:::

## What a paired device learns

A paired device knows your device's identifier and the name you gave it. It does not learn your files, your
plugins, or your network — and a plugin looking at the device list receives identifiers rather than addresses.

## When a device goes quiet

A paired device that stops answering is shown as offline rather than removed. Its session ends on its own after
the heartbeat timeout, and it comes back without re-pairing when it returns.

::: tip Offline is not unpairing
Unplugging a laptop does not make you pair it again. Only the two deliberate actions — unpairing and blocking —
change what a device is allowed to do.
:::

## Next

- [Send something](/guide/quick-start) — the first thing to try once two devices are paired.
- [Clipboard & Files](/guide/transfers) — what can be sent.
- [Troubleshooting](/guide/troubleshooting) — when a device does not appear.

---
name: remotion-best-practices
description: Router for all Remotion skills
version: 4.0.539
---

> Cópia reduzida da skill oficial `remotion-dev/skills` (v4.0.539) para o canal Pera AI: tiramos mapas,
> SaaS e upgrade, que não usamos. Nas rotinas o render faz parte do trabalho (não espere
> pedido explícito). Para o padrão de animação do canal, use a skill `pera-animacao`.

## Preserve user changes

Users may make edits in the code outside of the conversation.

If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation.

## Creating a video

If the user asks to make, create, or build a new video or composition, load [Create a new Remotion video](./remotion-create/REFERENCE.md), whether or not a Remotion project already exists.

## New project setup

If no Remotion project currently exists, load [Create a new Remotion project](./remotion-create/REFERENCE.md)

## React Markup Best Practices

If you are writing Remotion React Markup, load [Remotion Markup Best Practices](./remotion-markup/REFERENCE.md)

## Multimedia

For achieving multimedia tasks in the browser, such as trimming, cropping videos, or getting metadata from them, load [Remotion Multimedia](./remotion-multimedia/REFERENCE.md)

## Render the video

```
npx remotion render
```

For more options, see [Rendering](./remotion-render/REFERENCE.md).

For advanced rendering beyond simple `npx remotion render`, see: [Rendering Best Practices](./remotion-render/REFERENCE.md)

## Captions

When working with Captions, load [Remotion Captions](./remotion-captions/REFERENCE.md).

## Looking up Remotion APIs and documentation

To find and read current Remotion documentation, load [Remotion Docs](./remotion-docs/REFERENCE.md).

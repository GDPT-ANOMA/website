# DESIGN.md — GĐPT Anôma

## Physical scene

A parent opens this on a phone in the temple parking lot, Sunday morning light, kids already in áo lam. The site should feel like the chapter itself: cloth, emblem green, a typed handout — not a meditation app.

## Color strategy: Committed

Áo lam carries large surfaces; emblem green is signal only.

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#EEF1F4` | Page ground — cool, tinted toward lam (not cream) |
| `sen` | `#FAFBFC` | Raised surface / handout sheet |
| `ink` | `#1A2630` | Body text |
| `lam` | `#6B8499` | Áo lam field, links, chrome |
| `lam-deep` | `#3A5164` | Strong text on paper, footer |
| `la` | `#007C3D` | Emblem green from chapter SVG — CTAs, focus, emphasis |

### Critique (tokens)

| Draft | Generic for any youth nonprofit? | Change |
| --- | --- | --- |
| Sage `#2d4b37` + cream `#f8f6f2` (old site) | Yes — wellness default | Replaced with áo lam + cool paper |
| Terracotta accent | Yes — AI editorial | Never used |
| Soft mint accent | Yes | Dropped; green is only emblem `#007C3D` |
| Near-black + acid accent | Yes | Dropped |

## Typography

| Role | Face | Why this brief |
| --- | --- | --- |
| Display + UI | **Be Vietnam Pro** | Built for Vietnamese diacritics (ư, ơ, ậ, Đ). Matches the chapter’s bilingual constraint; bold weights echo the hand-painted ANÔMA banner. |
| Body | **Be Vietnam Pro** (regular/medium) | One family — pairing a “warm serif” would recreate the cream-editorial AI look we banned. Hierarchy = weight + size, not costume fonts. |

Rejected: Cormorant Garamond + Public Sans (old site / reflex). Fraunces, Playfair, Inter, Instrument Serif.

## Layout concept

Quiet chrome. Brand-first hero (Vietnamese name dominates). One signature block. Then plain sections: what Sunday is, ngành, upcoming, how to join. No three-up icon cards.

```
┌──────────────────────────────────────┐
│ [emblem] GĐPT Anôma     nav   EN VI │
├──────────────────────────────────────┤
│ Gia Đình Phật Tử Anôma               │  brand
│ Sundays · time · place               │
│ [Come this Sunday]  [Text a leader]  │
│ ▓▓▓▓▓ chapter photo full-bleed ▓▓▓▓▓ │
├──────────────────────────────────────┤
│ ┌ TỜ LỊCH CHỦ NHẬT / SUNDAY ──────┐ │  SIGNATURE
│ │ 09:00  Chào cờ …                │ │
│ │ 09:30  Học / Activities …         │ │
│ └─────────────────────────────────┘ │
├──────────────────────────────────────┤
│ What a child does · what to wear     │
│ Ngành as definition list             │
│ Upcoming (list, not cards)           │
│ Enroll / contact                     │
└──────────────────────────────────────┘
```

## Signature element

**Tờ lịch Chủ Nhật** — the Sunday handout: a ruled, bilingual schedule sheet with the chapter emblem stamp. Dense type, clear times, looks like something taped to the temple door. Boldness lives only here.

## Motion

Almost none. Optional 200ms opacity on the handout under `prefers-reduced-motion: no-preference`. No scroll theatre.

## Post-build cut

Removed the handout’s offset drop-shadow after screenshot review — it read as a SaaS card, not a sheet taped to a temple door. Flat double-weight border only.

## Rejected as generic

Material/Lucide icons · organic blur blobs · glassmorphism · countdown clocks · “Cultivating Compassion” hero · three event cards with badges · Coming Soon empty states · stock lotus vectors · purple/blue meshes · cream + terracotta · numbered 01/02/03 markers · em-dash marketing copy.

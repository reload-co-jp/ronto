import { IconName } from "@/lib/types"

/** 登場人物のアイコン（24px グリッドの線画）。色は親の color を継承する */
const paths: Record<IconName, React.ReactNode> = {
  "shopping-cart": (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2.6l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L21 7H6.2" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8.5 6.5h7v3h-7z" />
      <path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4z" />
  ),
  building: (
    <>
      <path d="M3 21h18M4.5 9.5h15M12 3l8 5.5H4z" />
      <path d="M6.5 12v6M10 12v6M14 12v6M17.5 12v6" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M7 21h10M5 7h14" />
      <path d="M5 7l-3 7a3.2 3.2 0 0 0 6 0zM19 7l-3 7a3.2 3.2 0 0 0 6 0z" />
    </>
  ),
}

export const PersonaIcon = ({
  name,
  size = 24,
}: {
  name: IconName
  size?: number
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {paths[name]}
  </svg>
)

/** 登場人物ごとの配色（並び順で割り当て） */
export const participantPalette = [
  { fg: "#2b2a33", bg: "#ffd9c7", bubble: "#ffe8de" },
  { fg: "#2b2a33", bg: "#c9ecdf", bubble: "#e3f6ee" },
  { fg: "#2b2a33", bg: "#d5dcff", bubble: "#e9ecff" },
  { fg: "#2b2a33", bg: "#ffd3e1", bubble: "#ffe7ef" },
  { fg: "#2b2a33", bg: "#cfe8fb", bubble: "#e6f3fd" },
  { fg: "#2b2a33", bg: "#ffe8a6", bubble: "#fff3cf" },
]

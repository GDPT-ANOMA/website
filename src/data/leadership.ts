import type { Locale } from "../i18n/site";

/** Set false to hide Anh/Chị prefixes on the Leaders page. */
export const SHOW_HONORIFICS = true;

export type Honorific = "anh" | "chi";

export type TeamId = "ht" | "ht-alumni" | "thieu";

export type Leader = {
  honorific: Honorific;
  name: string;
  /** Main point of contact — listed first; all email inquiries go here. */
  poc?: boolean;
};

export type LeadershipTeam = {
  id: TeamId;
  label: Record<Locale, string>;
  members: Leader[];
};

const HONORIFIC_LABEL: Record<Honorific, Record<Locale, string>> = {
  anh: { en: "Anh", vi: "Anh" },
  chi: { en: "Chi", vi: "Chị" },
};

export const POC_EMAIL = "gdptanoma@gmail.com";

const teamsRaw: LeadershipTeam[] = [
  {
    id: "ht",
    label: {
      en: "Huynh trưởng",
      vi: "Huynh trưởng",
    },
    members: [
      { honorific: "anh", name: "Hiệp", poc: true },
      { honorific: "anh", name: "Daniel" },
      { honorific: "chi", name: "Bang Tam" },
      { honorific: "chi", name: "Tracey" },
      { honorific: "chi", name: "Teresa" },
      { honorific: "anh", name: "Khoa" },
    ],
  },
  {
    id: "ht-alumni",
    label: {
      en: "Huynh trưởng Alumni",
      vi: "Cựu huynh trưởng",
    },
    members: [
      { honorific: "chi", name: "Amy" },
      { honorific: "chi", name: "Di Thảo" },
      { honorific: "chi", name: "Phương Thảo" },
      { honorific: "chi", name: "Mai" },
      { honorific: "chi", name: "Karen" },
      { honorific: "anh", name: "Charles" },
      { honorific: "anh", name: "Thuận" },
      { honorific: "anh", name: "Houston" },
      { honorific: "chi", name: "Serena" },
      { honorific: "anh", name: "Jimmy" },
      { honorific: "anh", name: "Derek" },
      { honorific: "chi", name: "Julianne" },
      { honorific: "chi", name: "Sarah" },
      { honorific: "chi", name: "Sally" },
      { honorific: "chi", name: "Vicky" },
      { honorific: "chi", name: "Jodie" },
    ],
  },
  {
    id: "thieu",
    label: {
      en: "Thiếu",
      vi: "Thiếu",
    },
    members: [
      { honorific: "chi", name: "Caitlyn" },
      { honorific: "chi", name: "Taman" },
      { honorific: "chi", name: "Kami" },
      { honorific: "anh", name: "Jaden" },
      { honorific: "chi", name: "Angelina" },
      { honorific: "chi", name: "Sylvia" },
      { honorific: "anh", name: "Kingston" },
      { honorific: "chi", name: "Brianna" },
      { honorific: "chi", name: "Dana" },
      { honorific: "chi", name: "Ngọc Anh" },
      { honorific: "chi", name: "Kim" },
      { honorific: "anh", name: "Jackie" },
      { honorific: "anh", name: "Travis" },
      { honorific: "chi", name: "Kaitlyn" },
      { honorific: "chi", name: "Vi" },
    ],
  },
];

function sortKey(name: string): string {
  return name.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function sortMembers(members: Leader[]): Leader[] {
  const poc = members.filter((m) => m.poc);
  const rest = members
    .filter((m) => !m.poc)
    .sort((a, b) => sortKey(a.name).localeCompare(sortKey(b.name), "en"));
  return [...poc, ...rest];
}

export const leadershipTeams: LeadershipTeam[] = teamsRaw.map((team) => ({
  ...team,
  members: sortMembers(team.members),
}));

export function formatLeaderName(
  leader: Leader,
  locale: Locale,
  showHonorifics = SHOW_HONORIFICS,
): string {
  if (!showHonorifics) return leader.name;
  return `${HONORIFIC_LABEL[leader.honorific][locale]} ${leader.name}`;
}

export function getPoc(): Leader | undefined {
  for (const team of leadershipTeams) {
    const poc = team.members.find((m) => m.poc);
    if (poc) return poc;
  }
  return undefined;
}

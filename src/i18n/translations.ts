export const locales = ["en", "vn"] as const;
export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "en";

export interface Translations {
  layout: {
    siteName: string;
    shortName: string;
    siteTagline: string;
    nav: {
      aboutUs: string;
      education: string;
      events: string;
      gallery: string;
    };
    registerPay: string;
    footer: {
      mission: string;
      resources: string;
      contact: string;
      resourceLinks: {
        schedule: string;
        curriculum: string;
        memberPortal: string;
        volunteering: string;
      };
      address: string;
      phone: string;
      copyright: string;
      privacy: string;
      terms: string;
    };
  };
  home: {
    established: string;
    heroTitleBefore: string;
    heroTitleAccent: string;
    heroTitleAfter: string;
    heroDescription: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    bannerLabel: string;
    bannerTitle: string;
    bannerLocationDate: string;
    bannerAction: string;
    missionTitle: string;
    missionParagraph1: string;
    missionParagraph2: string;
    missionCommunityTitle: string;
    missionCommunityBody: string;
    missionNatureTitle: string;
    missionNatureBody: string;
    missionQuote: string;
    missionMembers: string;
    eventsTitle: string;
    eventsSubtitle: string;
    eventsLink: string;
    eventsCards: {
      badge: string;
      meta: string;
      title: string;
      description: string;
      button: string;
    }[];
    ctaTitle: string;
    ctaBody: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  placeholder: {
    titlePrefix: string;
    body: string;
    backHome: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    layout: {
      siteName: "GDPT Anoma",
      shortName: "Gia Dinh Phat Tu",
      siteTagline: "Vietnamese Buddhist Youth Association",
      nav: {
        aboutUs: "About Us",
        education: "Education",
        events: "Events",
        gallery: "Gallery",
      },
      registerPay: "Register & Pay",
      footer: {
        mission:
          "Building a future anchored in Buddhist wisdom and cultural pride. Our doors are always open to new members and seekers.",
        resources: "Resources",
        contact: "Contact",
        resourceLinks: {
          schedule: "Weekly Schedule",
          curriculum: "Curriculum",
          memberPortal: "Member Portal",
          volunteering: "Volunteering",
        },
        address: "123 Harmony Lane, Westminster, CA 92683",
        phone: "(714) 555-0199",
        copyright: "2026 GDPT Anoma. All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      },
    },
    home: {
      established: "Established 1951",
      heroTitleBefore: "Cultivating",
      heroTitleAccent: "Compassion",
      heroTitleAfter: "and Wisdom",
      heroDescription:
        "Welcome to GDPT Anoma. We are the Vietnamese Buddhist Youth Association dedicated to spiritual growth, community leadership, and cultural preservation through the teachings of Dharma.",
      heroPrimaryCta: "Join Our Family",
      heroSecondaryCta: "Learn More",
      bannerLabel: "Upcoming Major Event",
      bannerTitle: "Vesak Celebration 2026",
      bannerLocationDate: "Anoma Buddhist Temple • May 15, 2026",
      bannerAction: "Secure Your Spot",
      missionTitle: "Our Mission & Roots",
      missionParagraph1:
        "Founded on the principles of compassion, self-discipline, and wisdom, GDPT Anoma serves as a beacon for Vietnamese-American youth to reconnect with their spiritual heritage.",
      missionParagraph2:
        "For over 70 years globally, our association has focused on five core virtues: Diligence, Compassion, Purity, Wisdom, and Harmony. Through these, we empower the next generation to be mindful leaders and compassionate citizens.",
      missionCommunityTitle: "Community",
      missionCommunityBody: "Fostering lifelong bonds and brotherhood.",
      missionNatureTitle: "Nature",
      missionNatureBody: "Connecting with the world through outdoor retreats.",
      missionQuote: '"To see things as they truly are."',
      missionMembers: "Over 200+ Active Members",
      eventsTitle: "Upcoming Gatherings",
      eventsSubtitle:
        "Join us for dharma talks, community service, and youth activities.",
      eventsLink: "View Full Calendar",
      eventsCards: [
        {
          badge: "Every Saturday",
          meta: "2:00 PM - 5:00 PM",
          title: "Youth Dharma Class",
          description:
            "Introduction to mindfulness and Buddhist philosophy through interactive storytelling.",
          button: "Details",
        },
        {
          badge: "Apr 22",
          meta: "Community Park",
          title: "Anoma Green Initiative",
          description:
            "Annual tree planting and park cleanup to practice stewardship of our environment.",
          button: "Details",
        },
        {
          badge: "Jul 10-17",
          meta: "Overnight Stay",
          title: "Wisdom Summer Retreat",
          description:
            "A week of deep connection, outdoor activities, and meditation in the mountains.",
          button: "Register Now",
        },
      ],
      ctaTitle: "Support Our Growth",
      ctaBody:
        "Your contributions help us provide scholarships, maintain our facilities, and host life-changing retreats for the youth.",
      ctaPrimary: "Donate & Support",
      ctaSecondary: "Sponsor a Youth",
    },
    placeholder: {
      titlePrefix: "Coming Soon:",
      body: "This page is being redesigned as part of the new GDPT Anoma experience.",
      backHome: "Back to Home",
    },
  },
  vn: {
    layout: {
      siteName: "GDPT Anoma",
      shortName: "Gia Dinh Phat Tu",
      siteTagline: "Gia Dinh Phat Tu Viet Nam",
      nav: {
        aboutUs: "Gioi Thieu",
        education: "Giao Duc",
        events: "Su Kien",
        gallery: "Thu Vien",
      },
      registerPay: "Dang Ky & Dong Phi",
      footer: {
        mission:
          "Xay dung tuong lai dua tren tri tue Phat giao va niem tu hao van hoa. Chung toi luon chao don thanh vien moi.",
        resources: "Tai Nguyen",
        contact: "Lien He",
        resourceLinks: {
          schedule: "Lich Sinh Hoat",
          curriculum: "Chuong Trinh Hoc",
          memberPortal: "Cong Thanh Vien",
          volunteering: "Tinh Nguyen",
        },
        address: "123 Harmony Lane, Westminster, CA 92683",
        phone: "(714) 555-0199",
        copyright: "2026 GDPT Anoma. Bao luu moi quyen.",
        privacy: "Chinh Sach Bao Mat",
        terms: "Dieu Khoan Su Dung",
      },
    },
    home: {
      established: "Thanh lap 1951",
      heroTitleBefore: "Nuoi duong",
      heroTitleAccent: "Tu Bi",
      heroTitleAfter: "va Tri Tue",
      heroDescription:
        "Chao mung den voi GDPT Anoma. Chung toi la Gia Dinh Phat Tu Viet Nam, noi dong hanh cung thanh thieu nien tren hanh trinh tu hoc, lanh dao phung su, va giu gin ban sac van hoa.",
      heroPrimaryCta: "Tham Gia Gia Dinh",
      heroSecondaryCta: "Tim Hieu Them",
      bannerLabel: "Su Kien Lon Sap Toi",
      bannerTitle: "Dai Le Phat Dan 2026",
      bannerLocationDate: "Chua Anoma • Ngay 15 thang 5, 2026",
      bannerAction: "Giu Cho Ngay",
      missionTitle: "Su Menh & Coi Nguon",
      missionParagraph1:
        "Duoc xay dung tren nen tang tu bi, ky luat va tri tue, GDPT Anoma la cau noi giup gioi tre Viet tai Hoa Ky ket noi lai voi truyen thong tam linh.",
      missionParagraph2:
        "Hon 70 nam phat trien tren toan cau, to chuc chung ta kien dinh nam gia tri cot loi: Tinh Tan, Tu Bi, Thanh Tinh, Tri Tue, va Hoa Hop.",
      missionCommunityTitle: "Cong Dong",
      missionCommunityBody: "Boi dap tinh than huynh de va gan bo suot doi.",
      missionNatureTitle: "Thien Nhien",
      missionNatureBody: "Ket noi voi cuoc song qua nhung khoa tu ngoai troi.",
      missionQuote: '"Thay su vat nhu chung dang la."',
      missionMembers: "Hon 200+ thanh vien dang sinh hoat",
      eventsTitle: "Sinh Hoat Sap Toi",
      eventsSubtitle:
        "Dong hanh cung chung toi qua phap thoai, cong tac xa hoi, va chuong trinh thanh thieu.",
      eventsLink: "Xem Toan Bo Lich",
      eventsCards: [
        {
          badge: "Moi Thu Bay",
          meta: "2:00 PM - 5:00 PM",
          title: "Lop Phat Phap Thieu Nhi",
          description:
            "Huong dan chanh niem va giao ly can ban qua ke chuyen va hoat dong tuong tac.",
          button: "Chi Tiet",
        },
        {
          badge: "22 thang 4",
          meta: "Cong Vien Cong Dong",
          title: "Du An Xanh Anoma",
          description:
            "Trong cay va don dep cong vien hang nam de thuc hanh tinh than bao ve moi truong.",
          button: "Chi Tiet",
        },
        {
          badge: "10-17 thang 7",
          meta: "Luu Tru Qua Dem",
          title: "Trai He Tri Tue",
          description:
            "Mot tuan ket noi sau sac voi thien nhien, thien tap va sinh hoat doi nhom.",
          button: "Dang Ky",
        },
      ],
      ctaTitle: "Chung Tay Phat Trien",
      ctaBody:
        "Su dong hanh cua quy vi giup chung toi cap hoc bong, duy tri co so, va to chuc cac khoa tu y nghia cho thanh thieu nien.",
      ctaPrimary: "Ung Ho",
      ctaSecondary: "Bao Tro Doan Sinh",
    },
    placeholder: {
      titlePrefix: "Sap Ra Mat:",
      body: "Trang nay dang duoc thiet ke lai theo giao dien moi cua GDPT Anoma.",
      backHome: "Ve Trang Chu",
    },
  },
};

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname === "/vn" || pathname.startsWith("/vn/")) {
    return "vn";
  }

  return DEFAULT_LOCALE;
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

export function toLocalePath(locale: Locale): string {
  return locale === "vn" ? "/vn" : "/";
}

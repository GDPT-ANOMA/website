export type Locale = "en" | "vi";

export const DEFAULT_LOCALE: Locale = "en";

export const site = {
  nameShort: "GĐPT Anôma",
  nameVi: "Gia Đình Phật Tử Anôma",
  nameEn: "The Vietnamese Buddhist Youth Association",
  foundation: {
    en: "Vạn Hạnh Foundation",
    vi: "Quỹ Vạn Hạnh",
  },
  email: "gdptanoma@gmail.com",
  /** No public chapter phone on file — email only. Do not invent a number. */
  phoneDisplay: "",
  phoneTel: "",
  textHint: {
    en: "Text the chapter lead with your child’s name and age.",
    vi: "Nhắn đoàn trưởng: ghi tên và tuổi của con.",
  },
  address: {
    en: "14867 Spinning Ave.",
    vi: "14867 Spinning Ave.",
  },
  addressLines: {
    en: ["Gardena, CA 90249"],
    vi: ["Gardena, CA 90249"],
  },
  sunday: {
    en: "Sundays · 9:00 AM–2:00 PM",
    vi: "Chủ Nhật · 9:00 sáng–2:00 chiều",
  },
  wear: {
    en: "Members wear the blue uniform (áo lam). Guests: neat clothes, closed-toe shoes, water bottle.",
    vi: "Đoàn sinh mặc áo lam. Khách: quần áo gọn gàng, giày kín mũi, mang nước.",
  },
} as const;

export function localeFromPath(pathname: string): Locale {
  if (pathname === "/vi" || pathname.startsWith("/vi/")) return "vi";
  return DEFAULT_LOCALE;
}

export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  if (locale === "vi") return clean ? `/vi${clean}` : "/vi";
  return clean || "/";
}

export function t<T extends Record<Locale, string>>(
  dict: T,
  locale: Locale,
): string {
  return dict[locale] ?? dict.en;
}

export const copy = {
  nav: {
    about: { en: "About", vi: "Giới thiệu" },
    schedule: { en: "Schedule", vi: "Lịch" },
    nganh: { en: "Age groups", vi: "Ngành" },
    team: { en: "Leaders", vi: "Huynh trưởng" },
    contact: { en: "Contact", vi: "Liên hệ" },
  },
  cta: {
    sunday: { en: "Come this Sunday", vi: "Đến Chủ Nhật này" },
    text: { en: "Email the chapter", vi: "Gửi email đoàn" },
    join: { en: "How to join", vi: "Cách ghi danh" },
  },
  home: {
    kicker: {
      en: "The Vietnamese Buddhist Youth Association · Gardena, CA",
      vi: "Gia Đình Phật Tử · Gardena, CA",
    },
    lead: {
      en: "A Sunday program for Vietnamese-American kids: formation, Buddhist teachings, and age-group time.",
      vi: "Sinh hoạt Chủ Nhật cho các em Việt Mỹ: tập hợp, Phật pháp, và giờ ngành.",
    },
    photoAlt: {
      en: "GĐPT Anôma members in blue uniforms with the chapter banner",
      vi: "Đoàn sinh GĐPT Anôma mặc áo lam cùng biểu ngữ đoàn",
    },
    handoutLabel: {
      en: "Sunday handout",
      vi: "Tờ lịch Chủ Nhật",
    },
    handoutTitle: {
      en: "Sunday schedule",
      vi: "Lịch Chủ Nhật",
    },
    handoutSub: {
      en: "Same rhythm most weeks. Special days get announced the Sunday before.",
      vi: "Nhịp thường lệ hầu hết các tuần. Ngày đặc biệt sẽ báo trước vào Chủ Nhật trước đó.",
    },
    sundayTitle: {
      en: "What a child does on Sunday",
      vi: "Một Chủ Nhật của các em",
    },
    sundayBody: {
      en: "They line up, move a little, then spend the morning in their age group. Not a lecture hall. Younger kids sing and play; teens dig into lessons and skills. Parents can wait in the hall or help when asked.",
      vi: "Tập hợp, vận động nhẹ, rồi sinh hoạt theo ngành. Không phải ngồi nghe giảng dài. Em nhỏ hát và chơi; thiếu niên học và luyện kỹ năng. Phụ huynh có thể ngồi hội trường hoặc phụ khi được nhờ.",
    },
    wearTitle: { en: "What to wear", vi: "Trang phục" },
    nganhTitle: { en: "Age groups", vi: "Ngành" },
    nganhLead: {
      en: "Three age groups — Đồng (Oanh Vũ), Thiếu, Thanh — plus the adult leaders. Bi – Trí – Dũng is shared; Sunday looks different by group.",
      vi: "Ba ngành theo tuổi — Đồng (Oanh Vũ), Thiếu, Thanh — cùng Ban Huynh trưởng. Bi – Trí – Dũng chung; từng ngành sinh hoạt khác nhau.",
    },

    eventsTitle: { en: "Coming up", vi: "Sắp tới" },
    eventsEmpty: {
      en: "No dated events in the file yet. Check the Sunday handout or email the chapter.",
      vi: "Chưa có sự kiện nào được đăng. Xem tờ lịch Chủ Nhật hoặc email đoàn.",
    },
    eventsPrev: { en: "Previous", vi: "Trước" },
    eventsNext: { en: "Next", vi: "Sau" },
    eventsPage: { en: "Page", vi: "Trang" },
    announceTitle: { en: "Notes for families", vi: "Thông báo cho gia đình" },
    joinTitle: { en: "Show up once", vi: "Đến thử một buổi" },
    joinBody: {
      en: "Bring your child a little before 9:00. Tell the door lead it’s your first Sunday. Stay through the morning; pick up by 2:00. Ask about fees, uniforms, and which age group fits.",
      vi: "Đưa các em tới trước 9:00. Nói với anh chị trực cửa đây là Chủ Nhật đầu. Ở lại buổi sáng; đón trước 2:00. Hỏi lệ phí, áo lam, và ngành phù hợp.",
    },
  },
  about: {
    title: { en: "About GĐPT Anôma", vi: "Về GĐPT Anôma" },
    lead: {
      en: "We are a local chapter of the Vietnamese Buddhist Youth Association. Kids grow up practicing Bi–Trí–Dũng with peers who share language, food, and Sunday habits.",
      vi: "Chúng tôi là một đơn vị Gia Đình Phật Tử. Các em lớn lên với Bi–Trí–Dũng cùng bạn bè chung tiếng Việt, món ăn, và nếp Chủ Nhật.",
    },
    pillarsTitle: { en: "Bi – Trí – Dũng", vi: "Bi – Trí – Dũng" },
    bi: {
      en: "Compassion in how we speak and help.",
      vi: "Từ bi trong lời nói và giúp đỡ.",
    },
    tri: {
      en: "Clear thinking: study, ask, practice.",
      vi: "Trí tuệ: học, hỏi, thực hành.",
    },
    dung: {
      en: "Courage to do hard, honest things together.",
      vi: "Dũng cảm làm việc khó và đúng cùng nhau.",
    },
    anthem: {
      en: "We sing Sen Trắng. It is not background music. It is how the chapter starts and ends big days.",
      vi: "Chúng tôi hát Sen Trắng. Không phải nhạc nền. Đó là cách đoàn mở và kết những ngày lớn.",
    },
  },
  schedulePage: {
    title: { en: "Schedule & events", vi: "Lịch sinh hoạt" },
    lead: {
      en: "Weekly Sunday block first. Full 2026 chapter program below.",
      vi: "Khối Chủ Nhật trước. Chương trình Anôma năm 2026 ở dưới.",
    },
    calendarTitle: { en: "From Google Calendar", vi: "Từ lịch Google" },
  },

  teamPage: {
    title: { en: "Leaders", vi: "Huynh trưởng" },
    lead: {
      en: "Teams that run Sundays. Email Anh Hiệp for anything — forms, absences, pickup changes.",
      vi: "Các ban phụ trách Chủ Nhật. Mọi việc — giấy tờ, báo nghỉ, đổi người đón — email Anh Hiệp.",
    },
    poc: { en: "Point of contact", vi: "Liên hệ chính" },
    pocNote: {
      en: "All email inquiries go to Anh Hiệp (chapter lead).",
      vi: "Mọi email hỏi đoàn gửi cho Anh Hiệp (đoàn trưởng).",
    },
    empty: {
      en: "No leaders listed yet. Email gdptanoma@gmail.com and ask for the chapter lead.",
      vi: "Chưa có danh sách. Email gdptanoma@gmail.com hỏi đoàn trưởng.",
    },
  },
  contactPage: {
    title: { en: "Contact", vi: "Liên hệ" },
    lead: {
      en: "For enrollment, absences, or pickup changes, email works best. Put your child’s name in the subject.",
      vi: "Ghi danh, báo nghỉ, hoặc đổi người đón: nên email. Ghi tên các em ở tiêu đề.",
    },
    formName: { en: "Your name", vi: "Họ tên" },
    formEmail: { en: "Email", vi: "Email" },
    formSubject: { en: "Subject", vi: "Tiêu đề" },
    formMessage: { en: "Message", vi: "Nội dung" },
    formSubmit: { en: "Send", vi: "Gửi" },
    formSending: { en: "Sending…", vi: "Đang gửi…" },
    formOk: {
      en: "Sent. We will reply from the chapter email.",
      vi: "Đã gửi. Đoàn sẽ trả lời từ email đoàn.",
    },
    formErr: {
      en: "Could not send. Email gdptanoma@gmail.com directly.",
      vi: "Gửi không được. Xin gửi thẳng tới gdptanoma@gmail.com.",
    },
  },
  notFound: {
    title: { en: "Page not found", vi: "Không tìm thấy trang" },
    body: {
      en: "That URL is not on this site. Go home for Sunday times, or open Schedule for events.",
      vi: "Không tìm thấy trang này. Về trang chủ xem giờ Chủ Nhật, hoặc mở Lịch xem sự kiện.",
    },
    home: { en: "Home", vi: "Trang chủ" },
    schedule: { en: "Schedule", vi: "Lịch" },
  },
  footer: {
    mission: {
      en: "GĐPT Anôma meets Sundays, 9:00 AM–2:00 PM at 14867 Spinning Ave., Gardena, CA 90249.",
      vi: "GĐPT Anôma sinh hoạt Chủ Nhật, 9:00 sáng–2:00 chiều tại 14867 Spinning Ave., Gardena, CA 90249.",
    },
  },
} as const;

export type Locale = "en" | "vi";

export const DEFAULT_LOCALE: Locale = "en";

export const site = {
  nameShort: "GĐPT Anôma",
  nameVi: "Gia Đình Phật Tử Anôma",
  nameEn: "Vietnamese Buddhist Youth Family, Anôma",
  email: "gdptanoma@gmail.com",
  phoneDisplay: "(714) 555-0199",
  phoneTel: "+17145550199",
  textHint: {
    en: "Text đoàn trưởng and say your child’s name + age.",
    vi: "Nhắn đoàn trưởng: tên + tuổi của con.",
  },
  address: {
    en: "Anôma temple hall. Ask for GĐPT when you arrive.",
    vi: "Hội trường chùa Anôma. Hỏi GĐPT khi tới.",
  },
  addressLines: {
    en: ["Westminster / Orange County, CA"],
    vi: ["Westminster / Orange County, CA"],
  },
  sunday: {
    en: "Sundays · 8:30 AM–2:00 PM",
    vi: "Chủ Nhật · 8:30 sáng–2:00 chiều",
  },
  wear: {
    en: "Members wear áo lam. Guests: neat clothes, closed-toe shoes, water bottle.",
    vi: "Đoàn sinh mặc áo lam. Khách: quần áo gọn, giày kín mũi, mang nước.",
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
    nganh: { en: "Ngành", vi: "Ngành" },
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
      en: "Gia Đình Phật Tử · Orange County",
      vi: "Gia Đình Phật Tử · Orange County",
    },
    lead: {
      en: "A Sunday chương trình for Vietnamese-American kids: formation, Phật pháp, and ngành time. Run by huynh trưởng who know your family by name.",
      vi: "Sinh hoạt Chủ Nhật cho các em Việt tại Mỹ: tập hợp, Phật pháp, và giờ ngành. Do huynh trưởng điều hành, biết từng gia đình.",
    },
    photoAlt: {
      en: "GĐPT Anôma members in áo lam with the chapter banner",
      vi: "Đoàn sinh GĐPT Anôma mặc áo lam cùng bảng hiệu đoàn",
    },
    handoutLabel: {
      en: "Sunday handout",
      vi: "Tờ lịch Chủ Nhật",
    },
    handoutTitle: {
      en: "Tờ lịch Chủ Nhật",
      vi: "Tờ lịch Chủ Nhật",
    },
    handoutSub: {
      en: "Same rhythm most weeks. Special days get announced the Sunday before.",
      vi: "Nhịp thường lệ hầu hết các tuần. Ngày đặc biệt sẽ báo Chủ Nhật trước.",
    },
    sundayTitle: {
      en: "What a child does on Sunday",
      vi: "Một Chủ Nhật của các em",
    },
    sundayBody: {
      en: "They line up, move a little, then spend the morning in their ngành. Not a lecture hall. Younger kids sing and play; teens dig into lessons and skills. Parents can wait in the hall or help when asked.",
      vi: "Tập hợp, vận động nhẹ, rồi sinh hoạt theo ngành. Không phải ngồi nghe giảng dài. Em nhỏ hát và chơi; thiếu niên học và luyện kỹ năng. Phụ huynh có thể ngồi hội trường hoặc phụ khi được nhờ.",
    },
    wearTitle: { en: "What to wear", vi: "Mặc gì" },
    nganhTitle: { en: "Ngành", vi: "Ngành" },
    nganhLead: {
      en: "Age groups under one đoàn. Bi – Trí – Dũng is the shared aim; the day looks different by ngành.",
      vi: "Các lứa tuổi trong một đoàn. Bi – Trí – Dũng là hướng chung; từng ngành sinh hoạt khác nhau.",
    },
    eventsTitle: { en: "Coming up", vi: "Sắp tới" },
    eventsEmpty: {
      en: "No dated events in the file yet. Check the Sunday handout or email the chapter.",
      vi: "Chưa có sự kiện trong tệp. Xem tờ lịch Chủ Nhật hoặc email đoàn.",
    },
    announceTitle: { en: "Notes for families", vi: "Thông báo gia đình" },
    joinTitle: { en: "Show up once", vi: "Đến thử một buổi" },
    joinBody: {
      en: "Bring your child a little before 9:00 for Vietnamese class (Thiếu set up from 8:30). Tell the door lead it’s your first Sunday. Stay through the morning; pick up by 2:00. Ask about fees, áo lam, and which ngành fits.",
      vi: "Đưa các em tới trước 9:00 cho lớp Việt ngữ (Thiếu chuẩn bị từ 8:30). Nói với anh chị cửa là Chủ Nhật đầu. Ở lại buổi sáng; đón trước 2:00. Hỏi lệ phí, áo lam, và ngành phù hợp.",
    },
  },
  about: {
    title: { en: "About GĐPT Anôma", vi: "Về GĐPT Anôma" },
    lead: {
      en: "We are a local chapter of Gia Đình Phật Tử, a Vietnamese Buddhist youth family. Kids grow up practicing Bi–Trí–Dũng with peers who share language, food, and Sunday habits.",
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
      en: "We sing Sen Trắng. It is not background music. It is how the đoàn starts and ends big days.",
      vi: "Chúng tôi hát Sen Trắng. Không phải nhạc nền. Đó là cách đoàn mở và kết những ngày lớn.",
    },
  },
  schedulePage: {
    title: { en: "Schedule & events", vi: "Lịch sinh hoạt" },
    lead: {
      en: "Weekly Sunday block first. Dated events below. Google Calendar sync appears when keys are set.",
      vi: "Khối Chủ Nhật trước. Sự kiện có ngày ở dưới. Lịch Google hiện khi đã cấu hình khóa.",
    },
    calendarTitle: { en: "From Google Calendar", vi: "Từ Google Calendar" },
    calendarEmpty: {
      en: "Calendar feed is not connected. Use the events list above, or set GOOGLE_CALENDAR_API_KEY and GOOGLE_CALENDAR_ID.",
      vi: "Chưa nối lịch Google. Dùng danh sách ở trên, hoặc đặt GOOGLE_CALENDAR_API_KEY và GOOGLE_CALENDAR_ID.",
    },
  },
  teamPage: {
    title: { en: "Leaders", vi: "Huynh trưởng" },
    lead: {
      en: "People who run Sundays. Email the chapter if you need a name for a form or a pickup change.",
      vi: "Người điều hành Chủ Nhật. Email đoàn nếu cần tên cho giấy tờ hoặc đổi người đón.",
    },
    empty: {
      en: "No leaders listed yet. Email gdptanoma@gmail.com and ask for đoàn trưởng.",
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
      vi: "Đã gửi. Đoàn sẽ trả lời từ email chương trình.",
    },
    formErr: {
      en: "Could not send. Email gdptanoma@gmail.com directly.",
      vi: "Gửi không được. Email thẳng gdptanoma@gmail.com.",
    },
  },
  notFound: {
    title: { en: "Page not found", vi: "Không tìm thấy trang" },
    body: {
      en: "That URL is not on this site. Go home for Sunday times, or open Schedule for events.",
      vi: "Không có địa chỉ này. Về trang chủ xem giờ Chủ Nhật, hoặc mở Lịch xem sự kiện.",
    },
    home: { en: "Home", vi: "Trang chủ" },
    schedule: { en: "Schedule", vi: "Lịch" },
  },
  footer: {
    mission: {
      en: "GĐPT Anôma meets Sundays, 8:30 AM–2:00 PM. Ask any huynh trưởng in áo lam.",
      vi: "GĐPT Anôma sinh hoạt Chủ Nhật, 8:30 sáng–2:00 chiều. Hỏi huynh trưởng mặc áo lam.",
    },
  },
} as const;

import type { LocaleText } from "./itinerary";

export type ReservationType = "hotel" | "restaurant" | "activity";
export type ReservationStatus = "confirmed" | "pending" | "cancelled";

export interface Reservation {
  id: string;
  type: ReservationType;
  status: ReservationStatus;
  title: LocaleText;
  jp?: string;
  vendor?: LocaleText;
  confirmationNumber?: string;
  dateLabel: LocaleText;
  timeLabel?: LocaleText;
  party?: LocaleText;
  address?: string;
  phone?: string;
  email?: string;
  bookingUrl?: string;
  notes?: LocaleText;
  linkedDay: string;
  linkedStop: LocaleText;
}

export const RESERVATIONS: Reservation[] = [
  {
    id: "res-hotel-otani",
    type: "hotel",
    status: "confirmed",
    title: { en: "Hotel New Otani Hakata", zh: "博多新大谷飯店" },
    jp: "ホテルニューオータニ博多",
    vendor: { en: "Booking.com (placeholder)", zh: "Booking.com（範例）" },
    confirmationNumber: "OTANI-XXXX-XXXX",
    dateLabel: {
      en: "Check-in Jun 5 · Check-out Jun 6",
      zh: "6月5日入住 · 6月6日退房",
    },
    timeLabel: {
      en: "Check-in from 15:00 · Check-out by 11:00",
      zh: "15:00 入住 · 11:00 前退房",
    },
    party: { en: "1 room · 2 adults", zh: "1間客房 · 2位成人" },
    address: "〒810-0004 Watanabe-dori 1-1-2, Chuo-ku, Fukuoka",
    phone: "092-715-2000",
    email: "reservations@example.com",
    bookingUrl: "https://example.com/booking-otani",
    notes: {
      en: "Placeholder card — replace with the actual confirmation PDF, reservation code, and any room preferences once you have them.",
      zh: "範例卡片 — 收到正式預訂單後，請將確認編號與房型備註替換為實際資料。",
    },
    linkedDay: "01",
    linkedStop: { en: "Tonight’s Stay (Day 1)", zh: "Day 1 今晚住宿" },
  },
  {
    id: "res-dinner-toriden",
    type: "restaurant",
    status: "confirmed",
    title: { en: "Hakata Mizutaki Toriden", zh: "博多水炊き とり田（本店）" },
    jp: "博多水炊き とり田 (Hakata Main Store)",
    vendor: { en: "TableCheck (placeholder)", zh: "TableCheck（範例）" },
    confirmationNumber: "TORIDEN-XXXX",
    dateLabel: { en: "Thu, June 5 (Day 1)", zh: "6月5日 週四（Day 1）" },
    timeLabel: { en: "17:00 seating", zh: "17:00 入座" },
    party: { en: "4 guests · counter or table", zh: "4位 · 吧檯或桌位" },
    address:
      "10-5 Shimokawabata-cho, Hakata Kojiyaban Bldg 1F, Hakata-ku, Fukuoka 812-0027",
    phone: "+81-92-272-0920",
    bookingUrl: "https://toriden.com/",
    notes: {
      en: "Placeholder card — note allergies / dietary requests and any deposit terms once confirmed.",
      zh: "範例卡片 — 確認後請補上飲食過敏與訂金條款。",
    },
    linkedDay: "01",
    linkedStop: { en: "Dinner — Toriden (Day 1)", zh: "Day 1 晚餐 — とり田" },
  },
  {
    id: "res-cruise-yanagawa",
    type: "activity",
    status: "pending",
    title: { en: "Yanagawa River Cruise", zh: "柳川遊船" },
    jp: "柳川 川下り",
    vendor: { en: "Yanagawa Tourist Assoc. (placeholder)", zh: "柳川觀光協會（範例）" },
    confirmationNumber: "YANAGAWA-XXXX",
    dateLabel: { en: "Fri, June 6 (Day 2)", zh: "6月6日 週五（Day 2）" },
    timeLabel: { en: "10:00 boarding · ~70 min ride", zh: "10:00 登船 · 約70分鐘" },
    party: { en: "4 guests · 1 donko-bune boat", zh: "4位 · 1艘どんこ舟" },
    address:
      "Boarding ~5 min walk from Nishitetsu Yanagawa Station, Yanagawa City, Fukuoka",
    phone: "+81-944-72-6177",
    bookingUrl: "https://www.yanagawa-net.com/en/",
    notes: {
      en: "Placeholder card — boats are cancelled in heavy rain, common in early June. Plan a wet-weather backup (Tanaka Yasuko Residence, Kitahara Hakushu Museum) and update the status / time once final.",
      zh: "範例卡片 — 雨大會停航（6月初常見梅雨）。建議備案：北原白秋紀念館、田中家舊宅。確認後請更新狀態與時間。",
    },
    linkedDay: "02",
    linkedStop: { en: "Yanagawa River Cruise (Day 2)", zh: "Day 2 柳川遊船" },
  },
];

export function getReservation(id: string): Reservation | undefined {
  return RESERVATIONS.find((r) => r.id === id);
}

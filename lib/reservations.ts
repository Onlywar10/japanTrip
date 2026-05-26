import type { LocaleText } from "./itinerary";

export type ReservationType = "hotel" | "restaurant" | "activity";
export type ReservationStatus = "confirmed" | "pending" | "cancelled";

export interface RoomLine {
  count: number;
  desc: LocaleText;
}

export interface Reservation {
  id: string;
  type: ReservationType;
  status: ReservationStatus;
  title: LocaleText;
  jp?: string;
  dateLabel: LocaleText;
  timeLabel?: LocaleText;
  party?: LocaleText;
  rooms?: RoomLine[];
  meal?: LocaleText;
  plan?: LocaleText;
  confirmationNumbers?: string[];
  address?: string;
  phone?: string;
  bookingUrl?: string;
  notes?: LocaleText;
  linkedDay: string;
  linkedStop: LocaleText;
}

const TAX_NOTE: LocaleText = {
  en: "Accommodation & city tax not included — payable at the front desk.",
  zh: "不含住宿稅與城市稅，依櫃台現場收取為準。",
};

export const RESERVATIONS: Reservation[] = [
  {
    id: "res-hotel-otani",
    type: "hotel",
    status: "confirmed",
    title: { en: "Hotel New Otani Hakata", zh: "博多新大谷飯店" },
    jp: "ホテルニューオータニ博多",
    dateLabel: { en: "Jun 5 → Jun 6 · 1 night", zh: "6月5日 → 6月6日 · 一晚" },
    rooms: [
      { count: 4, desc: { en: "Medium twin · non-smoking", zh: "中型雙床房 · 禁菸" } },
      {
        count: 1,
        desc: { en: "Medium twin + extra bed · non-smoking", zh: "中型雙床房 + 加床 · 禁菸" },
      },
    ],
    meal: { en: "Breakfast", zh: "早餐" },
    confirmationNumbers: ["5862125425", "6416291759"],
    address: "〒810-0004 Watanabe-dori 1-1-2, Chuo-ku, Fukuoka",
    phone: "092-715-2000",
    notes: TAX_NOTE,
    linkedDay: "01",
    linkedStop: { en: "Overnight in Fukuoka (Day 1)", zh: "Day 1 入住福岡" },
  },
  {
    id: "res-dinner-toriden",
    type: "restaurant",
    status: "confirmed",
    title: { en: "Hakata Mizutaki Toriden", zh: "博多水炊き とり田" },
    jp: "博多水炊き とり田 博多本店",
    dateLabel: { en: "Thu, Jun 5 · Day 1", zh: "6月5日 週四 · Day 1" },
    timeLabel: { en: "17:00 dinner seating", zh: "17:00 入座（晚餐）" },
    party: { en: "11 adults", zh: "11 位大人" },
    plan: {
      en: "Pre-ordered: Hakata Toriden “Mankitsu” tasting course × 11",
      zh: "預選餐點：博多とり田滿喫套餐 × 11",
    },
    address:
      "10-5 Shimokawabata-cho, Hakata Kojiyaban Bldg 1F, Hakata-ku, Fukuoka 812-0027",
    phone: "+81-92-272-0920",
    bookingUrl: "https://toriden.com/",
    notes: { en: "Reserved under the name “chen”.", zh: "預約名：chen。" },
    linkedDay: "01",
    linkedStop: { en: "Dinner — Toriden (Day 1)", zh: "Day 1 晚餐 — とり田" },
  },
  {
    id: "res-hotel-candeo",
    type: "hotel",
    status: "confirmed",
    title: { en: "Candeo Hotels Kumamoto Shinshigai", zh: "熊本新市街光芒飯店" },
    jp: "カンデオホテルズ熊本新市街",
    dateLabel: { en: "Jun 6 → Jun 7 · 1 night", zh: "6月6日 → 6月7日 · 一晚" },
    rooms: [
      { count: 4, desc: { en: "Hollywood twin · non-smoking", zh: "好萊塢雙床房 · 禁菸" } },
      { count: 1, desc: { en: "Deluxe triple · non-smoking", zh: "豪華三人房 · 禁菸" } },
    ],
    meal: { en: "Breakfast", zh: "早餐" },
    confirmationNumbers: ["1359042172416776", "1359042172377284"],
    address: "〒860-0803 Shinshigai 8-7, TERRACE87 (Reception 12F), Chuo-ku, Kumamoto",
    phone: "096-327-8480",
    notes: TAX_NOTE,
    linkedDay: "02",
    linkedStop: { en: "Overnight in Kumamoto (Day 2)", zh: "Day 2 入住熊本" },
  },
  {
    id: "res-hotel-kyukamura",
    type: "hotel",
    status: "confirmed",
    title: { en: "Kyukamura Minami Aso", zh: "休暇村 南阿蘇" },
    jp: "休暇村 南阿蘇",
    dateLabel: { en: "Jun 7 → Jun 8 · 1 night", zh: "6月7日 → 6月8日 · 一晚" },
    rooms: [
      {
        count: 4,
        desc: {
          en: "Japanese-style 8-tatami · private bath & toilet · non-smoking",
          zh: "日式 8 疊和室 · 附衛浴 · 禁菸",
        },
      },
    ],
    plan: {
      en: "[Jun–Jul] Kumamoto Fruit Kingdom — luxury half-melon & premium buffet",
      zh: "【6月・7月】水果王國熊本 · 奢華半顆哈密瓜＋高級自助餐",
    },
    meal: { en: "Breakfast & dinner", zh: "早餐及晚餐" },
    confirmationNumbers: ["IY1522298289", "IY1522301057"],
    address: "〒869-1602 Takamori 3219, Takamori-machi, Aso-gun, Kumamoto",
    phone: "0967-62-2111",
    notes: TAX_NOTE,
    linkedDay: "03",
    linkedStop: { en: "Overnight at Aso Onsen (Day 3)", zh: "Day 3 入住阿蘇溫泉" },
  },
  {
    id: "res-hotel-shikian",
    type: "hotel",
    status: "confirmed",
    title: { en: "Sansou Shikian", zh: "山莊 四季庵" },
    jp: "山荘 四季庵",
    dateLabel: { en: "Jun 8 → Jun 9 · 1 night", zh: "6月8日 → 6月9日 · 一晚" },
    rooms: [
      {
        count: 4,
        desc: {
          en: "Japanese-Western room · private semi-open-air onsen · non-smoking",
          zh: "和洋室 · 附半露天溫泉 · 禁菸",
        },
      },
    ],
    plan: {
      en: "[No.1 Popular] Oita Wagyu & local chicken charcoal grill",
      zh: "【人氣No.1】大分和牛與在地土雞炭火燒烤方案",
    },
    meal: { en: "Breakfast & dinner", zh: "早餐及晚餐" },
    confirmationNumbers: ["IY1522306908", "IY1522307967"],
    address: "〒879-5101 Tsukahara, Kurokasagi 135-37, Yufuin-cho, Yufu City, Oita",
    phone: "0977-85-3484",
    notes: TAX_NOTE,
    linkedDay: "04",
    linkedStop: { en: "Overnight in Yufuin (Day 4)", zh: "Day 4 入住湯布院" },
  },
  {
    id: "res-hotel-richmond",
    type: "hotel",
    status: "confirmed",
    title: { en: "Richmond Hotel Fukuoka Tenjin", zh: "福岡天神列治文飯店" },
    jp: "リッチモンドホテル福岡天神",
    dateLabel: { en: "Jun 9 → Jun 10 · 1 night", zh: "6月9日 → 6月10日 · 一晚" },
    rooms: [
      { count: 3, desc: { en: "1 queen bed + 1 single bed", zh: "1 張加大雙人床 + 1 張單人床" } },
      {
        count: 1,
        desc: { en: "Deluxe double · 2 guests · non-smoking", zh: "豪華雙人房 · 2 人 · 禁菸" },
      },
    ],
    meal: { en: "Breakfast", zh: "早餐" },
    confirmationNumbers: ["73361178654034", "1359042163158080"],
    address: "〒810-0004 Watanabe-dori 4-8-25, Chuo-ku, Fukuoka",
    phone: "092-739-2055",
    notes: TAX_NOTE,
    linkedDay: "05",
    linkedStop: { en: "Overnight in Fukuoka (Day 5)", zh: "Day 5 入住福岡" },
  },
];

export function getReservation(id: string): Reservation | undefined {
  return RESERVATIONS.find((r) => r.id === id);
}

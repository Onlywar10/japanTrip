export type Lang = "en" | "zh";

export type LocaleText = string | { en: string; zh: string };

export type StopType =
  | "plane"
  | "car"
  | "shrine"
  | "food"
  | "shopping"
  | "nature"
  | "sight"
  | "transport"
  | "hotel";

export interface Highlight {
  title: LocaleText;
  body: LocaleText;
}

export interface Stop {
  time?: string;
  endTime?: string;
  title: LocaleText;
  jp?: string;
  type: StopType;
  simple?: boolean;
  pill?: LocaleText;
  gold?: boolean;
  desc?: LocaleText;
  address?: string;
  maps?: string;
  web?: string;
  tip?: LocaleText;
  highlights?: Highlight[];
  reservationId?: string;
}

export interface Hotel {
  name: LocaleText;
  jp?: string;
  addr: LocaleText;
  tel?: string | null;
  maps: string;
  departure?: boolean;
  reservationId?: string;
}

export interface Day {
  n: string;
  date: LocaleText;
  dow: LocaleText;
  city: LocaleText;
  title: LocaleText;
  start: string;
  car: LocaleText;
  kanji: string;
  note?: LocaleText;
  stops: Stop[];
  hotel: Hotel;
}

export const T = (v: LocaleText | undefined, lang: Lang): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return v[lang] ?? v.en;
};

export const UI = {
  brand: { en: "Kyūshū Itinerary", zh: "九州行程" },
  dates: { en: "June 5 – 10", zh: "6月5日–10日" },
  eyebrow: { en: "Southern Japan · Self-Drive Tour", zh: "南九州 · 包車之旅" },
  titleMain: { en: "Six Days Across Kyūshū", zh: "縱橫九州 六日" },
  titleJp: { en: "九州六日間", zh: "九州六日間" },
  route: {
    en: ["Fukuoka", "Kumamoto", "Takachiho", "Aso", "Yufuin", "Beppu", "Fukuoka"],
    zh: ["福岡", "熊本", "高千穗", "阿蘇", "湯布院", "別府", "福岡"],
  },
  meta: {
    en: "Tap any stop to expand its map address, official site, and highlights.",
    zh: "點擊任一行程，展開地圖地址、官方網站與亮點。",
  },
  dayLabel: { en: "Day", zh: "第" },
  start: { en: "Start", zh: "出發" },
  car: { en: "Car", zh: "用車" },
  poi: { en: "Points of interest", zh: "亮點推薦" },
  gmap: { en: "Google Maps", zh: "Google 地圖" },
  site: { en: "Official site", zh: "官方網站" },
  stay: { en: "Tonight’s Stay", zh: "今晚住宿" },
  dest: { en: "Final Destination", zh: "最終目的地" },
  openmap: { en: "Open in Google Maps", zh: "用 Google 地圖開啟" },
  foot: { en: "Kyūshū Six-Day Journey · Safe travels", zh: "九州六日之旅 · 一路平安" },
  tabItinerary: { en: "Itinerary", zh: "行程" },
  tabReservations: { en: "Reservations", zh: "預約" },
  tabAlbum: { en: "Album", zh: "相簿" },
  albumTitle: { en: "Trip Album", zh: "旅程相簿" },
  albumSub: {
    en: "A shared place for the family — upload your favourite shots and grab everyone else’s with one tap.",
    zh: "家人共享的相簿 — 上傳精彩瞬間，也能一鍵下載所有人的照片。",
  },
  albumEmpty: {
    en: "No photos yet. Be the first to upload!",
    zh: "目前還沒有照片，快來上傳第一張！",
  },
  albumNotConfigured: {
    en: "Photo storage isn’t set up yet. Add a Vercel Blob store and BLOB_READ_WRITE_TOKEN to enable uploads.",
    zh: "照片儲存尚未設定。請在 Vercel 上新增 Blob 儲存空間並設定 BLOB_READ_WRITE_TOKEN。",
  },
  upload: { en: "Upload Photos", zh: "上傳照片" },
  uploading: { en: "Uploading", zh: "上傳中" },
  saveAll: { en: "Save All", zh: "全部儲存" },
  saveSelected: { en: "Save Selected", zh: "儲存所選" },
  select: { en: "Select", zh: "選取" },
  selectAll: { en: "Select all", zh: "全選" },
  clear: { en: "Clear", zh: "清除" },
  cancel: { en: "Cancel", zh: "取消" },
  done: { en: "Done", zh: "完成" },
  selectedCount: { en: "selected", zh: "已選" },
  photoCount: {
    en: { one: "photo", many: "photos" },
    zh: { one: "張", many: "張" },
  },
  preparingDownload: { en: "Preparing download…", zh: "準備下載中…" },
  saved: { en: "Saved to your device", zh: "已儲存至裝置" },
  sharedViaSheet: { en: "Opened in share sheet", zh: "已開啟分享" },
  saveError: { en: "Could not save photos", zh: "儲存失敗" },
  deletePhoto: { en: "Delete photo", zh: "刪除照片" },
  confirmDelete: {
    en: "Delete this photo? This can’t be undone.",
    zh: "確定刪除這張照片？無法復原。",
  },
  closeViewer: { en: "Close", zh: "關閉" },
  uploadHint: {
    en: "JPEG, PNG, HEIC up to 25 MB each. iPhones auto-convert HEIC when you pick a photo.",
    zh: "支援 JPEG、PNG、HEIC（每張最大 25 MB）。iPhone 透過瀏覽器選照片時會自動轉檔。",
  },
  viewReservation: { en: "View Reservation", zh: "查看預約" },
  reservationsTitle: { en: "Reservations & Tickets", zh: "預約與票券" },
  reservationsSub: {
    en: "Hotel bookings, restaurant reservations, tours and tickets — kept in one place.",
    zh: "飯店、餐廳、體驗與票券預約 — 一站式整理。",
  },
  reservationsEmpty: {
    en: "No reservations yet. Add some details and I’ll wire them in.",
    zh: "尚未新增預約。請提供細節後再加入。",
  },
  resType: {
    hotel: { en: "Hotel", zh: "飯店" },
    restaurant: { en: "Restaurant", zh: "餐廳" },
    activity: { en: "Activity / Ticket", zh: "體驗 / 票券" },
  },
  resStatus: {
    confirmed: { en: "Confirmed", zh: "已確認" },
    pending: { en: "Pending", zh: "待確認" },
    cancelled: { en: "Cancelled", zh: "已取消" },
  },
  confirmationNumber: { en: "Order no.", zh: "訂單編號" },
  phone: { en: "Phone", zh: "電話" },
  address: { en: "Address", zh: "地址" },
  rooms: { en: "Rooms", zh: "房型" },
  meals: { en: "Meals", zh: "餐食" },
  plan: { en: "Plan", zh: "方案" },
  vendor: { en: "Booked via", zh: "預訂平台" },
  party: { en: "Party", zh: "人數" },
  contact: { en: "Contact", zh: "聯絡" },
  notes: { en: "Notes", zh: "備註" },
  openBooking: { en: "Open booking", zh: "開啟預訂連結" },
  jumpToItinerary: { en: "See on itinerary", zh: "回到行程中" },
  downloadReservations: { en: "Download PDF", zh: "下載 PDF" },
  pdfGenerated: { en: "Generated", zh: "產生時間" },
  placeholderBanner: {
    en: "These cards are placeholders — replace with real confirmations once you’re ready.",
    zh: "以下卡片為範例 — 收到正式確認後請替換為實際資料。",
  },

  // Budget
  tabBudget: { en: "Budget", zh: "預算" },
  budgetTitle: { en: "Family Budget", zh: "家庭預算" },
  budgetSub: {
    en: "Our shared trip pot — log who put money in and what we spend along the way.",
    zh: "家庭共用旅費 — 記錄誰存入、一路上花了什麼。",
  },
  balanceLeft: { en: "Balance left", zh: "剩餘金額" },
  totalIn: { en: "Added", zh: "存入" },
  totalOut: { en: "Spent", zh: "支出" },
  addTransaction: { en: "Add", zh: "新增" },
  newTransaction: { en: "New entry", zh: "新增一筆" },
  editTransaction: { en: "Edit entry", zh: "編輯" },
  kindIncome: { en: "Money in", zh: "存入" },
  kindExpense: { en: "Spending", zh: "支出" },
  fieldAmount: { en: "Amount", zh: "金額" },
  fieldDescription: { en: "Description", zh: "說明" },
  fieldCategory: { en: "Category", zh: "分類" },
  fieldMember: { en: "Who", zh: "成員" },
  fieldDate: { en: "Date", zh: "日期" },
  optional: { en: "optional", zh: "選填" },
  save: { en: "Save", zh: "儲存" },
  saving: { en: "Saving…", zh: "儲存中…" },
  delete: { en: "Delete", zh: "刪除" },
  confirmDeleteTx: {
    en: "Delete this entry? This can’t be undone.",
    zh: "確定刪除這筆紀錄？無法復原。",
  },
  budgetEmpty: {
    en: "No entries yet. Tap “Add” to log the first one.",
    zh: "尚無紀錄。點「新增」記下第一筆。",
  },
  descriptionRequired: { en: "Add a short description", zh: "請輸入說明" },
  amountRequired: { en: "Enter an amount above 0", zh: "請輸入大於 0 的金額" },

  // Individual accounts
  tabMembers: { en: "Personal", zh: "個人" },
  membersTitle: { en: "Personal Accounts", zh: "個人帳戶" },
  membersSub: {
    en: "Each traveller’s own pocket money — tracked separately from the family pot.",
    zh: "每位旅人的個人零用金 — 與家庭旅費分開記帳。",
  },
  addPerson: { en: "Add person", zh: "新增成員" },
  newPerson: { en: "New person", zh: "新增成員" },
  editPerson: { en: "Edit person", zh: "編輯成員" },
  personName: { en: "Name", zh: "姓名" },
  nameRequired: { en: "Enter a name", zh: "請輸入姓名" },
  renamePerson: { en: "Rename", zh: "改名" },
  deletePerson: { en: "Remove person", zh: "移除成員" },
  confirmDeletePerson: {
    en: "Remove this person and all their entries? This can’t be undone.",
    zh: "移除此成員及其所有紀錄？無法復原。",
  },
  noMembers: {
    en: "No one added yet. Add a family member to start their account.",
    zh: "尚未新增成員。新增家庭成員即可開始記帳。",
  },
} as const;

export const PILL = {
  lunch: { en: "Lunch", zh: "午餐" },
  reserved: { en: "Reserved", zh: "已預約" },
  by18: { en: "By 18:00", zh: "18:00前" },
  bye: { en: "Sayōnara", zh: "再見" },
} as const;

export const DAYS: Day[] = [
  {
    n: "01",
    date: { en: "June 5", zh: "6月5日" },
    dow: { en: "Tue", zh: "週二" },
    city: { en: "Fukuoka", zh: "福岡" },
    title: { en: "Touchdown in Fukuoka", zh: "抵達福岡" },
    start: "11:20",
    car: { en: "Until 21:10", zh: "至21:10" },
    kanji: "福",
    note: {
      en: "Today may run over schedule — keep an eye on time at each stop so the 17:00 dinner reservation stays on track.",
      zh: "今日行程可能超時 — 請留意各景點停留時間，以免影響17:00的晚餐預約。",
    },
    stops: [
      {
        time: "11:20",
        endTime: "12:30",
        title: { en: "Arrive Fukuoka Airport, Terminal 1", zh: "抵達福岡機場 第1航廈" },
        type: "plane",
        simple: true,
      },
      {
        title: { en: "Meet the driver / pickup", zh: "與司機會合 / 接機" },
        type: "car",
        simple: true,
      },
      {
        time: "13:10",
        endTime: "15:00",
        title: { en: "Dazaifu Tenmangu Shrine", zh: "太宰府天滿宮" },
        jp: "太宰府天満宮",
        type: "shrine",
        pill: PILL.lunch,
        desc: {
          en: "A 1,100-year-old shrine to Tenjin, the deity of learning, set among ~6,000 plum trees with a lively souvenir-and-snack approach.",
          zh: "供奉學問之神菅原道真的千年古社，境內植有約6,000株梅樹，參道兩旁滿是小吃與土產店。",
        },
        address: "4-7-1 Saifu, Dazaifu City, Fukuoka 818-0195",
        maps: "Dazaifu Tenmangu Shrine",
        web: "https://www.dazaifutenmangu.or.jp/en/",
        tip: {
          en: "The main hall is under renovation through ~2026 (worship is at a temporary hall). Grab a freshly grilled umegae-mochi on the approach.",
          zh: "正殿整修至約2026年（暫於臨時殿參拜）。別錯過參道上現烤的梅枝餅。",
        },
      },
      {
        time: "15:50",
        endTime: "16:35",
        title: { en: "Kushida Shrine", zh: "櫛田神社" },
        jp: "櫛田神社",
        type: "shrine",
        desc: {
          en: "Hakata’s 1,250-year-old guardian shrine, affectionately called “Okushida-san” and home of the Hakata Gion Yamakasa festival.",
          zh: "博多的總鎮守，暱稱「お櫛田さん」，已有約1,250年歷史，也是博多祇園山笠祭的中心。",
        },
        address: "1-41 Kamikawabatamachi, Hakata-ku, Fukuoka 812-0026",
        maps: "Kushida Shrine Hakata Fukuoka",
        tip: {
          en: "The giant decorative Yamakasa float is displayed all year EXCEPT June (festival prep) — you may not catch it on this trip.",
          zh: "巨大的裝飾山笠花車全年展示，唯獨6月（祭典準備期）撤下 — 這趟可能看不到。",
        },
      },
      {
        time: "17:00",
        endTime: "19:00",
        title: { en: "Dinner — Hakata Mizutaki Toriden", zh: "晚餐 — 博多水炊き とり田" },
        jp: "博多水炊き とり田 (Hakata Main Store)",
        type: "food",
        pill: PILL.reserved,
        gold: true,
        reservationId: "res-dinner-toriden",
        desc: {
          en: "Michelin Bib Gourmand mizutaki specialist — a milky, collagen-rich chicken hot pot made with Kyushu free-range chicken.",
          zh: "米其林必比登推薦的水炊き名店 — 以九州土雞熬出乳白濃郁的雞湯火鍋。",
        },
        address:
          "10-5 Shimokawabata-cho, Hakata Kojiyaban Bldg 1F, Hakata-ku, Fukuoka 812-0027",
        maps: "Toriden Hakata Honten mizutaki",
        web: "https://toriden.com/",
        tip: {
          en: "Just behind Hakataza theatre, ~2 min from Nakasu-Kawabata Station.",
          zh: "位於博多座後方，距中洲川端站步行約2分鐘。",
        },
      },
      {
        time: "19:00",
        endTime: "21:00",
        title: { en: "Canal City Hakata", zh: "博多運河城" },
        jp: "キャナルシティ博多",
        type: "shopping",
        desc: {
          en: "A canal-side mega-complex with 250+ shops, hotels and a cinema, built around a central waterway with a fountain show.",
          zh: "環繞人工運河的大型複合商場，逾250間店舖、飯店與電影院，並有水舞表演。",
        },
        address: "1-2 Sumiyoshi, Hakata-ku, Fukuoka 812-0018",
        maps: "Canal City Hakata",
        web: "https://canalcity.co.jp/",
        highlights: [
          {
            title: { en: "Ramen Stadium", zh: "拉麵競技場" },
            body: {
              en: "top floor — famous ramen shops from across Japan",
              zh: "頂樓 — 匯集日本各地名店拉麵",
            },
          },
          {
            title: { en: "Jump Shop", zh: "JUMP SHOP" },
            body: {
              en: "One Piece, Naruto & Dragon Ball goods",
              zh: "航海王、火影忍者、七龍珠周邊",
            },
          },
          {
            title: { en: "Studio Ghibli “Donguri Kyowakoku”", zh: "吉卜力 橡子共和國" },
            body: { en: "Totoro & friends merchandise", zh: "龍貓等吉卜力商品" },
          },
          {
            title: { en: "Fountain Show", zh: "水舞表演" },
            body: {
              en: "runs in the canal roughly every 30 min",
              zh: "運河中約每30分鐘上演",
            },
          },
          {
            title: { en: "Canal City Opa & Muji", zh: "Canal City Opa 與無印良品" },
            body: {
              en: "~140 fashion & lifestyle stores",
              zh: "約140間時尚與生活雜貨店",
            },
          },
        ],
      },
      {
        time: "21:00",
        endTime: "21:10",
        title: { en: "Overnight in Fukuoka", zh: "入住福岡" },
        type: "hotel",
        simple: true,
      },
    ],
    hotel: {
      name: { en: "Hotel New Otani Hakata", zh: "博多新大谷飯店" },
      jp: "ホテルニューオータニ博多",
      addr: "〒810-0004 Watanabe-dori 1-1-2, Chuo-ku, Fukuoka",
      tel: "092-715-2000",
      maps: "Hotel New Otani Hakata",
      reservationId: "res-hotel-otani",
    },
  },
  {
    n: "02",
    date: { en: "June 6", zh: "6月6日" },
    dow: { en: "Wed", zh: "週三" },
    city: { en: "Kumamoto", zh: "熊本" },
    title: { en: "Waterways & a Great Castle", zh: "水鄉與名城" },
    start: "8:30",
    car: { en: "10 hours", zh: "10小時" },
    kanji: "熊",
    stops: [
      {
        time: "8:30",
        endTime: "9:30",
        title: { en: "Depart Fukuoka", zh: "福岡出發" },
        type: "car",
        simple: true,
      },
      {
        time: "9:30",
        endTime: "10:45",
        title: { en: "Yanagawa River Cruise", zh: "柳川遊船" },
        jp: "柳川 川下り",
        type: "nature",
        pill: PILL.reserved,
        gold: true,
        desc: {
          en: "A ~70-minute “donko-bune” punt down the willow-lined moats of the old castle town; boatmen pole and sing along the 4 km route.",
          zh: "搭乘「どんこ舟」沿柳樹環繞的護城河慢遊約70分鐘，船夫一面撐篙一面唱民謠，全程約4公里。",
        },
        address: "Boarding ~5 min from Nishitetsu Yanagawa Station, Yanagawa City, Fukuoka",
        maps: "Yanagawa River Cruise boarding",
        web: "https://www.yanagawa-net.com/en/",
        tip: {
          en: "Early June is iris season. For lunch, try Yanagawa’s specialty unagi seiro-mushi (steamed eel over rice).",
          zh: "6月初是菖蒲花季。午餐可嚐柳川名物「鰻魚蒸籠飯」（うなぎせいろ蒸し）。",
        },
      },
      {
        time: "10:45",
        endTime: "13:00",
        title: { en: "Lunch in Yanagawa", zh: "柳川午餐" },
        type: "food",
        simple: true,
      },
      {
        time: "14:30",
        endTime: "16:00",
        title: { en: "Kumamoto Castle (Castle Keep)", zh: "熊本城（天守閣）" },
        jp: "熊本城 天守閣",
        type: "sight",
        desc: {
          en: "One of Japan’s three great castles. The rebuilt main keep reopened in 2021 with top-floor city views and an AR history app.",
          zh: "日本三大名城之一。重建後的天守閣已於2021年重新開放，可登頂俯瞰市景並使用AR導覽App。",
        },
        address: "1-1 Honmaru, Chuo-ku, Kumamoto 860-0002",
        maps: "Kumamoto Castle",
        web: "https://castle.kumamoto-guide.jp/en/",
        tip: {
          en: "Earthquake reconstruction continues across the grounds (through ~2052); some turrets and walls remain fenced off.",
          zh: "震災修復工程仍在全城進行（預計至約2052年），部分櫓與石垣仍封閉。",
        },
      },
      {
        time: "16:05",
        endTime: "17:30",
        title: { en: "Sakuranobaba Johsaien", zh: "櫻之馬場 城彩苑" },
        jp: "桜の馬場 城彩苑",
        type: "shopping",
        desc: {
          en: "An Edo-style castle-town arcade at the foot of the castle — 23 shops and eateries plus the Wakuwaku-za history museum.",
          zh: "城下江戶風情商店街 — 23間店舖與餐廳，並設「湧湧座」歷史體驗館。",
        },
        address: "1-1 Ninomaru, Chuo-ku, Kumamoto 860-0008",
        maps: "Sakuranobaba Johsaien",
        web: "https://www.sakuranobaba-johsaien.jp/english/",
        highlights: [
          {
            title: { en: "Basashi", zh: "馬肉刺身" },
            body: { en: "horse-meat sashimi, a Kumamoto delicacy", zh: "熊本名物生馬肉" },
          },
          {
            title: { en: "Kumamoto ramen", zh: "熊本拉麵" },
            body: { en: "garlic-chip & pork broth", zh: "蒜片豚骨湯頭" },
          },
          {
            title: { en: "Karashi renkon", zh: "辛子蓮藕" },
            body: { en: "mustard-stuffed lotus root", zh: "芥末釀蓮藕" },
          },
          {
            title: { en: "Aso akaushi beef", zh: "阿蘇赤牛" },
            body: { en: "red-wagyu skewers & bowls", zh: "紅牛串燒與蓋飯" },
          },
          {
            title: { en: "Wakuwaku-za museum", zh: "湧湧座" },
            body: {
              en: "VR castle history + Edo costume try-on",
              zh: "VR歷史展與江戶服裝體驗",
            },
          },
        ],
      },
      {
        time: "17:40",
        title: { en: "Dinner — Katsuretsutei", zh: "晚餐 — 勝烈亭（新市街本店）" },
        jp: "勝烈亭 新市街本店",
        type: "food",
        desc: {
          en: "Kumamoto’s most celebrated tonkatsu house (Tabelog 100); you grind your own sesame for the dipping sauce.",
          zh: "熊本最負盛名的炸豬排店（Tabelog 100），可自行研磨芝麻調醬。",
        },
        address: "8-18 Shinshigai, Hayashi Bldg 1F, Chuo-ku, Kumamoto 860-0803",
        maps: "Katsuretsutei Shinshigai Honten",
        web: "https://hayashi-sangyo.jp/",
        tip: {
          en: "Order the roppaku kurobuta (premium black-pork) cutlet; cabbage, rice and miso soup are free refills.",
          zh: "推薦「六白黑豚」炸豬排；高麗菜、白飯與味噌湯免費續加。",
        },
      },
      { title: { en: "Overnight in Kumamoto", zh: "入住熊本" }, type: "hotel", simple: true },
    ],
    hotel: {
      name: { en: "Candeo Hotels Kumamoto Shinshigai", zh: "熊本新市街光芒飯店" },
      jp: "カンデオホテルズ熊本新市街",
      addr: "〒860-0803 Shinshigai 8-7, TERRACE87 (Reception 12F), Chuo-ku, Kumamoto",
      tel: "096-327-8480",
      maps: "Candeo Hotels Kumamoto Shinshigai",
      reservationId: "res-hotel-candeo",
    },
  },
  {
    n: "03",
    date: { en: "June 7", zh: "6月7日" },
    dow: { en: "Thu", zh: "週四" },
    city: { en: "Takachiho → Aso", zh: "高千穗 → 阿蘇" },
    title: { en: "Myths of Takachiho", zh: "高千穗神話之旅" },
    start: "8:00",
    car: { en: "10 hours", zh: "10小時" },
    kanji: "高",
    stops: [
      {
        time: "8:00",
        endTime: "10:00",
        title: { en: "Depart Kumamoto", zh: "熊本出發" },
        type: "car",
        simple: true,
      },
      {
        time: "10:00",
        endTime: "10:30",
        title: {
          en: "Takachiho Amaterasu Railway",
          zh: "高千穗天照鐵道（觀光小火車）",
        },
        jp: "高千穂あまてらす鉄道",
        type: "transport",
        desc: {
          en: "An open-top “Grand Super Cart” rolls along a disused railway with a glass floor, crossing the Takachiho Iron Bridge — at 105 m, Japan’s highest railway bridge.",
          zh: "敞篷「Grand Super Cart」行駛於廢線軌道、底部設玻璃地板，駛過高105公尺、日本最高的高千穗鐵橋。",
        },
        address:
          "1425-1 Mitai, Takachiho-cho, Nishiusuki-gun, Miyazaki 882-1101 (former Takachiho Station)",
        maps: "Takachiho Amaterasu Railway",
        web: "https://amaterasu-railway.jp/",
        tip: {
          en: "30-min round trip, ~10 departures/day, around ¥1,500. Tunnels are lit up and there’s a soap-bubble send-off.",
          zh: "單程約30分鐘，每日約10班，約¥1,500；隧道內燈光點綴，並有泡泡相送。",
        },
      },
      {
        time: "10:35",
        endTime: "12:00",
        title: { en: "Lunch near Takachiho", zh: "高千穗附近午餐" },
        type: "food",
        simple: true,
      },
      {
        time: "12:35",
        endTime: "13:35",
        title: { en: "Takachiho Shrine", zh: "高千穗神社" },
        jp: "高千穂神社",
        type: "shrine",
        desc: {
          en: "An ancient cedar-shrouded shrine; circle the “married” cedars (Meoto-sugi) hand-in-hand for luck, and catch the nightly kagura sacred dance.",
          zh: "杉林環抱的古社；可手牽手繞「夫婦杉」祈福，夜間並有「高千穗夜神樂」表演。",
        },
        address: "1037 Mitai, Takachiho-cho, Nishiusuki-gun, Miyazaki 882-1101",
        maps: "Takachiho Shrine",
        web: "https://takachiho-jinja.or.jp/",
        tip: {
          en: "A one-hour Takachiho Yokagura performance is held nightly at 20:00 (small fee).",
          zh: "每晚20:00有約1小時的高千穗夜神樂演出（須付少額費用）。",
        },
      },
      {
        time: "13:40",
        endTime: "14:00",
        title: { en: "Takachiho Gorge — Manai Falls", zh: "高千穗峽 — 真名井瀑布" },
        jp: "高千穂峡 真名井の滝",
        type: "nature",
        desc: {
          en: "A sheer basalt canyon carved by the Gokase River; the 17 m Manai Falls is one of Japan’s top-100 waterfalls. Walk the boardwalk above, or row a boat below.",
          zh: "五瀨川切割出的柱狀玄武岩峽谷；17公尺高的真名井瀑布名列日本百大瀑布。可走步道俯瞰，或租船近觀。",
        },
        address: "Mukoyama, Takachiho-cho, Nishiusuki-gun, Miyazaki 882-1103",
        maps: "Takachiho Gorge boat rental",
        web: "https://takachiho-kanko.info/en/",
        tip: {
          en: "Rowboats are ~¥4,100–5,100 / 30 min (up to 3 people) — reserve online (opens 9am, 2 weeks ahead). Boats are suspended after heavy rain, likely in the June rainy season, so have a backup.",
          zh: "租船約¥4,100–5,100／30分鐘（限3人）— 須線上預約（兩週前9:00開放）。大雨後會停航，6月梅雨期較常見，請備替代方案。",
        },
      },
      {
        time: "14:20",
        endTime: "16:20",
        title: { en: "Amano Iwato Shrine & Amano Yasugawara", zh: "天岩戶神社 & 天安河原" },
        jp: "天岩戸神社 & 天安河原",
        type: "shrine",
        desc: {
          en: "A shrine to the sun goddess Amaterasu, facing the sacred “heavenly rock cave” across the river. A 10-min riverside walk reaches Amano Yasugawara, a cavern covered in thousands of stacked prayer stones.",
          zh: "供奉天照大神的神社，隔河正對神聖的「天岩戶」洞窟。沿河步行約10分鐘可達天安河原 — 一處堆滿祈願石塔的岩窟。",
        },
        address: "1073-1 Iwato, Takachiho-cho, Nishiusuki-gun, Miyazaki 882-1621",
        maps: "Amano Iwato Shrine",
        web: "http://amanoiwato-jinja.jp/",
        tip: {
          en: "A priest leads free viewings of the cave roughly every 30 min (photography not allowed).",
          zh: "神官每約30分鐘帶領免費參觀岩戶（洞內禁止攝影）。",
        },
      },
      {
        time: "16:20",
        endTime: "18:00",
        title: { en: "Drive on to Aso", zh: "前往阿蘇" },
        type: "car",
        simple: true,
      },
      {
        title: { en: "Grocery stop — central Takamori", zh: "高森町中心採買" },
        type: "shopping",
        simple: true,
      },
      {
        time: "18:00",
        title: { en: "Overnight at Aso Onsen", zh: "入住阿蘇溫泉" },
        type: "hotel",
        pill: PILL.by18,
        gold: true,
        simple: true,
      },
    ],
    hotel: {
      name: { en: "Kyukamura Minami Aso", zh: "休暇村 南阿蘇" },
      jp: "休暇村 南阿蘇",
      addr: "〒869-1602 Takamori 3219, Takamori-machi, Aso-gun, Kumamoto",
      tel: "0967-62-2111",
      maps: "Kyukamura Minami Aso",
      reservationId: "res-hotel-kyukamura",
    },
  },
  {
    n: "04",
    date: { en: "June 8", zh: "6月8日" },
    dow: { en: "Fri", zh: "週五" },
    city: { en: "Yufuin", zh: "湯布院" },
    title: { en: "Volcano Country to Yufuin", zh: "火山國度到湯布院" },
    start: "8:30",
    car: { en: "10 hours", zh: "10小時" },
    kanji: "湯",
    stops: [
      {
        time: "8:30",
        endTime: "9:00",
        title: { en: "Depart Aso Onsen", zh: "阿蘇溫泉出發" },
        type: "car",
        simple: true,
      },
      {
        time: "9:00",
        endTime: "10:00",
        title: { en: "Kamishikimi Kumano-imasu Shrine", zh: "上色見熊野座神社" },
        jp: "上色見熊野座神社",
        type: "shrine",
        desc: {
          en: "A mystical “entrance to another world” — ~270 cedar-forest steps lined with ~100 moss-covered stone lanterns, climbing to the Ugeto-iwa rock arch.",
          zh: "宛如「通往異世界的入口」— 約270級杉林石階兩旁立著約100座青苔石燈籠，盡頭是巨岩拱門「穿戶岩」。",
        },
        address: "2619 Kamishikimi, Takamori-machi, Aso-gun, Kumamoto 869-1601",
        maps: "Kamishikimi Kumano-imasu Shrine",
        web: "https://kumamoto.guide/en/spots/detail/12741",
        tip: {
          en: "Wear proper shoes for the climb. Goshuin stamps are issued at the Takamori Tourism Office, not the shrine itself.",
          zh: "石階較陡，請穿好走的鞋。御朱印於高森町觀光協會領取，非神社現場。",
        },
      },
      {
        time: "10:35",
        endTime: "12:00",
        title: { en: "Kusasenri Plateau", zh: "草千里之濱" },
        jp: "草千里ヶ浜",
        type: "nature",
        pill: PILL.lunch,
        desc: {
          en: "A vast grassland crater-plain at the foot of Mt Aso, with a reflecting pond and grazing horses; the Aso Volcano Museum sits opposite.",
          zh: "阿蘇山麓的遼闊草原，有倒映群峰的水池與放牧的馬匹；對面即阿蘇火山博物館。",
        },
        address: "Kusasenri-ga-hama, Akamizu, Aso City, Kumamoto 869-2232",
        maps: "Kusasenri Aso",
        web: "https://aso-visitorcenter.com/en/",
        tip: {
          en: "Horseback riding is offered early March to mid-December.",
          zh: "騎馬體驗於3月初至12月中提供。",
        },
      },
      {
        time: "12:15",
        endTime: "13:00",
        title: { en: "Aso Volcano Crater (Nakadake)", zh: "阿蘇火山口（中岳）" },
        jp: "阿蘇山 中岳火口",
        type: "nature",
        desc: {
          en: "The steaming, milky-turquoise crater of active Nakadake — one of the few volcanoes you can drive almost right up to.",
          zh: "中岳活火山口冒著乳青色煙霧 — 是少數能近距離驅車抵達的火山之一。",
        },
        address: "Nakadake Crater, Mt Aso, Aso City, Kumamoto",
        maps: "Mount Aso Nakadake Crater",
        web: "https://aso-visitorcenter.com/en/",
        tip: {
          en: "Crater access closes at volcanic alert level 3+ or high gas readings — ALWAYS check the official status the morning of your visit. Those with asthma or heart conditions may be turned back near the vents.",
          zh: "當火山警戒達3級以上或氣體濃度過高時火口會封閉 — 請務必於當天早上查詢官方狀態。氣喘或心臟疾病者可能被勸退。",
        },
      },
      {
        time: "13:40",
        endTime: "14:40",
        title: { en: "Aso Shrine & Monzen-machi", zh: "阿蘇神社 & 門前町" },
        jp: "阿蘇神社 / 門前町",
        type: "shrine",
        desc: {
          en: "One of Japan’s oldest shrines (~2,300 yrs), famed for a massive twin-roofed tower gate (restored Dec 2023). The adjoining “water town” street is lined with spring-fed fountains and food shops.",
          zh: "日本最古老神社之一（約2,300年），以宏偉的雙層樓門聞名（已於2023年12月修復完成）。一旁的「水之町」門前町，沿街湧泉、café與美食林立。",
        },
        address: "3083-1 Miyaji, Ichinomiya-machi, Aso City, Kumamoto 869-2612",
        maps: "Aso Shrine",
        web: "http://asojinja.or.jp/",
        highlights: [
          {
            title: { en: "36 mizuki fountains", zh: "36處湧泉" },
            body: {
              en: "free spring water to taste along the street",
              zh: "沿街可免費品嚐的湧水",
            },
          },
          {
            title: { en: "Akaushi beef", zh: "赤牛" },
            body: { en: "red-wagyu rice bowls", zh: "紅牛蓋飯" },
          },
          {
            title: { en: "Aso milk soft-serve", zh: "阿蘇牛奶霜淇淋" },
            body: { en: "from local dairy farms", zh: "在地牧場鮮乳製" },
          },
          {
            title: { en: "Takana-meshi", zh: "高菜飯" },
            body: { en: "pickled-mustard-green rice", zh: "醃高菜拌飯" },
          },
          {
            title: { en: "Local sake & craft shops", zh: "在地酒造與工藝店" },
            body: {
              en: "well-established Monzen-machi stores",
              zh: "門前町老字號店家",
            },
          },
        ],
      },
      {
        time: "14:40",
        endTime: "17:30",
        title: { en: "Drive on to Yufuin", zh: "前往湯布院" },
        type: "car",
        simple: true,
      },
      {
        title: { en: "Convenience-store stop near Yufuin Station", zh: "湯布院車站附近超商" },
        type: "shopping",
        simple: true,
      },
      {
        time: "17:30",
        title: { en: "Overnight in Yufuin", zh: "入住湯布院" },
        type: "hotel",
        pill: PILL.by18,
        gold: true,
        simple: true,
      },
    ],
    hotel: {
      name: { en: "Sansou Shikian", zh: "山莊 四季庵" },
      jp: "山荘 四季庵",
      addr: "〒879-5101 Tsukahara, Kurokasagi 135-37, Yufuin-cho, Yufu City, Oita",
      tel: "0977-85-3484",
      maps: "Sansou Shikian Yufuin",
      reservationId: "res-hotel-shikian",
    },
  },
  {
    n: "05",
    date: { en: "June 9", zh: "6月9日" },
    dow: { en: "Sat", zh: "週六" },
    city: { en: "Beppu → Fukuoka", zh: "別府 → 福岡" },
    title: { en: "Hot Springs & the Hells", zh: "溫泉與地獄巡禮" },
    start: "9:00",
    car: { en: "10 hours", zh: "10小時" },
    kanji: "別",
    stops: [
      { title: { en: "Depart Yufuin", zh: "湯布院出發" }, type: "car", simple: true },
      {
        time: "9:00",
        endTime: "11:30",
        title: {
          en: "Yunotsubo Street — Floral Village & Snoopy Chaya",
          zh: "湯之坪街道 — 花卉村 & Snoopy茶屋",
        },
        jp: "湯の坪街道",
        type: "shopping",
        desc: {
          en: "Yufuin’s main strolling street, running from the station to Lake Kinrin and packed with sweets, cafes and character shops. Yufuin Floral Village recreates an English Cotswolds village.",
          zh: "湯布院的主要散步街道，自車站延伸至金鱗湖，甜點、café與卡通主題店林立。湯布院花卉村重現英國科茨沃爾德村莊風情。",
        },
        address: "Yunotsubo Kaido, Yufuincho Kawakami, Yufu City, Oita 879-5102",
        maps: "Yufuin Floral Village",
        highlights: [
          {
            title: { en: "Yufuin Floral Village", zh: "湯布院花卉村" },
            body: {
              en: "free-entry Cotswolds lane with Ghibli, Peter Rabbit, Harry Potter & Moomin shops + small animal cafes",
              zh: "免費入場的英倫小村，吉卜力、彼得兔、哈利波特、嚕嚕米等店與小動物咖啡",
            },
          },
          {
            title: { en: "Snoopy Chaya", zh: "Snoopy茶屋" },
            body: {
              en: "PEANUTS cafe — Snoopy lattes, Oita shiitake pizza & toriten",
              zh: "PEANUTS主題café — 史努比拿鐵、大分香菇披薩與雞天",
            },
          },
          {
            title: { en: "Miffy Mori no Kitchen", zh: "米飛兔森林廚房" },
            body: { en: "Miffy-shaped breads & buns", zh: "米飛兔造型麵包" },
          },
          {
            title: { en: "B-Speak P-roll", zh: "B-Speak 蛋糕卷" },
            body: { en: "famous fluffy roll cake", zh: "人氣鬆軟蛋糕卷" },
          },
          {
            title: { en: "Lake Kinrin", zh: "金鱗湖" },
            body: {
              en: "misty lakeside torii at the far end of the street",
              zh: "街道盡頭的晨霧湖畔鳥居",
            },
          },
        ],
      },
      {
        time: "12:00",
        endTime: "14:00",
        title: { en: "Lunch — Jigoku Kanko Lab ENMAN", zh: "午餐 — 地獄観光ラボ ENMAN" },
        jp: "地獄観光ラボ ENMAN",
        type: "food",
        desc: {
          en: "A modern hot-spring-town complex in Beppu’s Kannawa district gathering local restaurants and souvenir shops — a short hop from the “hells”, so lunch flows straight into the Jigoku Meguri tour.",
          zh: "別府鐵輪溫泉區的新型複合設施，匯集在地餐廳與伴手禮店 — 距地獄群僅數分鐘，午餐後可無縫接上地獄巡禮。",
        },
        address: "Kannawa, Beppu, Oita",
        maps: "Jigoku Kanko Lab Enman Beppu",
        tip: {
          en: "Right by the Kannawa hells — an easy, convenient lunch stop (~2 hrs) before the tour.",
          zh: "緊鄰鐵輪地獄群，是巡禮前方便的午餐點（停留約2小時）。",
        },
      },
      {
        time: "14:00",
        endTime: "16:00",
        title: { en: "Beppu “Hells” Tour (Jigoku Meguri)", zh: "別府地獄巡禮" },
        jp: "別府地獄めぐり",
        type: "nature",
        desc: {
          en: "Seven vividly coloured hot-spring “hells” — far too scalding to bathe in, made for viewing: cobalt-blue Umi Jigoku, blood-red Chinoike Jigoku, the Tatsumaki geyser, and crocodile-filled Oniyama Jigoku.",
          zh: "七處色彩鮮明的溫泉「地獄」— 滾燙不可入浴、專供觀賞：鈷藍的海地獄、血紅的血池地獄、噴泉的龍卷地獄，與養著鱷魚的鬼山地獄。",
        },
        address: "Kannawa & Shibaseki districts, Beppu, Oita",
        maps: "Beppu Jigoku Meguri Umi Jigoku",
        web: "https://www.beppu-jigoku.com/",
        tip: {
          en: "A single combo pass (around ¥2,000) covers all seven; five are clustered in Kannawa within walking distance (~2–3 hrs total).",
          zh: "一張通票（約¥2,000）可遊全部七處地獄；其中五處集中在鐵輪、步行可達（全程約2–3小時）。",
        },
      },
      {
        time: "16:00",
        endTime: "18:00",
        title: { en: "Drive on to Fukuoka", zh: "前往福岡" },
        type: "car",
        simple: true,
      },
      {
        time: "18:00",
        title: { en: "Tenjin Shopping Arcade", zh: "天神商店街購物" },
        jp: "天神商店街",
        type: "shopping",
        desc: {
          en: "Fukuoka’s downtown retail hub around Nishitetsu Tenjin Station — big department stores above ground and the elegant 590 m Tenjin Chikagai underground mall below.",
          zh: "福岡市中心、以西鐵天神站為核心的購物樞紐 — 地面有大型百貨，地下則是優雅的590公尺天神地下街。",
        },
        address: "Tenjin, Chuo-ku, Fukuoka 810-0001",
        maps: "Tenjin Chikagai Fukuoka",
        web: "https://www.tenchika.com/",
        highlights: [
          {
            title: { en: "Tenjin Chikagai", zh: "天神地下街" },
            body: {
              en: "12 weatherproof avenues, ~150 shops, 19th-c. European styling",
              zh: "12條不受天候影響的通道、約150間店、19世紀歐風裝潢",
            },
          },
          {
            title: { en: "Department stores", zh: "各大百貨" },
            body: {
              en: "PARCO, Solaria Plaza, Mitsukoshi, Daimaru, Iwataya & Tenjin LOFT",
              zh: "PARCO、Solaria、三越、大丸、岩田屋與天神LOFT",
            },
          },
          {
            title: { en: "Daimyo backstreets", zh: "大名巷弄" },
            body: { en: "indie boutiques, cafes & bars", zh: "個性小店、café與酒吧" },
          },
          {
            title: { en: "Acros Fukuoka", zh: "ACROS福岡" },
            body: { en: "climb the stepped rooftop garden", zh: "階梯式屋頂庭園" },
          },
          {
            title: { en: "Kego Park & Shrine", zh: "警固公園與神社" },
            body: { en: "a green breather between the shops", zh: "購物間的綠地小歇" },
          },
        ],
      },
      { title: { en: "Overnight in Fukuoka", zh: "入住福岡" }, type: "hotel", simple: true },
    ],
    hotel: {
      name: { en: "Richmond Hotel Fukuoka Tenjin", zh: "福岡天神列治文飯店" },
      jp: "リッチモンドホテル福岡天神",
      addr: "〒810-0004 Watanabe-dori 4-8-25, Chuo-ku, Fukuoka",
      tel: "092-739-2055",
      maps: "Richmond Hotel Fukuoka Tenjin",
      reservationId: "res-hotel-richmond",
    },
  },
  {
    n: "06",
    date: { en: "June 10", zh: "6月10日" },
    dow: { en: "Sun", zh: "週日" },
    city: { en: "Departure", zh: "啟程返家" },
    title: { en: "Sea Life & Farewell", zh: "海洋世界與啟程" },
    start: "8:15",
    car: { en: "10 hours", zh: "10小時" },
    kanji: "空",
    stops: [
      {
        time: "8:15",
        endTime: "9:00",
        title: { en: "Depart Fukuoka", zh: "福岡出發" },
        type: "car",
        simple: true,
      },
      {
        time: "9:00",
        endTime: "11:30",
        title: { en: "Marine World Uminonakamichi", zh: "海洋世界 海之中道" },
        jp: "マリンワールド海の中道",
        type: "sight",
        desc: {
          en: "A shell-shaped seaside aquarium themed on the seas of Kyushu — 350 species incl. 120+ sharks in a panoramic tank, plus a dolphin & sea-lion show over Hakata Bay.",
          zh: "貝殼造型的海濱水族館，以九州海域為主題 — 350種生物、全景大水槽中逾120尾鯊魚，並有以博多灣為背景的海豚與海獅秀。",
        },
        address: "18-28 Saitozaki, Higashi-ku, Fukuoka 811-0321",
        maps: "Marine World Uminonakamichi",
        web: "https://marine-world.jp/",
        tip: {
          en: "Inside Uminonakamichi Seaside Park; check the dolphin-show schedule when you arrive.",
          zh: "位於海之中道海濱公園內；抵達時記得查看海豚秀時間表。",
        },
      },
      {
        time: "12:00",
        endTime: "16:30",
        title: { en: "LaLaport Fukuoka", zh: "LaLaport 福岡" },
        jp: "ららぽーと福岡",
        type: "shopping",
        pill: PILL.lunch,
        desc: {
          en: "A huge Mitsui shopping park (220+ shops) crowned by a 24.8 m life-size RX-93ff ν Gundam statue that moves with a light show.",
          zh: "三井大型購物城（逾220間店），門口矗立24.8公尺、會動並搭配燈光秀的等身大RX-93ff ν鋼彈。",
        },
        address: "6-23-1 Naka, Hakata-ku, Fukuoka 812-8627",
        maps: "LaLaport Fukuoka",
        web: "https://mitsui-shopping-park.com/lalaport/fukuoka/",
        highlights: [
          {
            title: { en: "Life-size ν Gundam", zh: "等身大ν鋼彈" },
            body: {
              en: "free outdoor statue; day & evening light shows",
              zh: "免費戶外塑像，日夜燈光秀",
            },
          },
          {
            title: { en: "Gundam Park Fukuoka (4F)", zh: "鋼彈樂園 福岡（4樓）" },
            body: {
              en: "GUNDAM SIDE-F shop & VS PARK WITH G",
              zh: "GUNDAM SIDE-F商店與VS PARK WITH G",
            },
          },
          {
            title: { en: "namco arcade", zh: "namco 電玩" },
            body: { en: "games & crane machines", zh: "電玩與夾娃娃機" },
          },
          {
            title: { en: "Fukuoka Toy Museum", zh: "福岡玩具美術館" },
            body: {
              en: "~8,000 wooden toys, hands-on",
              zh: "約8,000件木製玩具、可動手玩",
            },
          },
          {
            title: { en: "MUJI, UNIQLO & food court", zh: "無印、UNIQLO 與美食街" },
            body: { en: "easy lunch before the flight", zh: "飛機前的輕鬆午餐" },
          },
        ],
      },
      {
        time: "16:30",
        endTime: "16:45",
        title: { en: "Head to Fukuoka Airport", zh: "前往福岡機場" },
        type: "car",
        simple: true,
      },
      {
        time: "16:45",
        title: { en: "Arrive Fukuoka Airport, Terminal 1", zh: "抵達福岡機場 第1航廈" },
        type: "plane",
        simple: true,
      },
      {
        time: "19:20",
        title: { en: "Flight departs", zh: "班機起飛" },
        type: "plane",
        pill: PILL.bye,
        gold: true,
        simple: true,
      },
    ],
    hotel: {
      name: { en: "Fukuoka Airport — Terminal 1", zh: "福岡機場 第1航廈" },
      jp: "福岡空港 T1",
      addr: {
        en: "Final drop-off. Allow time for check-in and security.",
        zh: "最終送機點。請預留報到與安檢時間。",
      },
      tel: null,
      maps: "Fukuoka Airport Terminal 1",
      departure: true,
    },
  },
];

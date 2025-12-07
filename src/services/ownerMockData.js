export const ownerProfile = {
  email: "owner@example.com",
  phone: "0987 654 321",
  venuesManaged: 3,
  joinedAt: "01/2024",
  rating: 4.8,
};

export const ownerVenues = [
  {
    id: 1,
    name: "Sân 12 Khuất Duy Tiến",
    address: "12 Khuất Duy Tiến, Thanh Xuân",
    courts: 6,
    status: "Hoạt động",
    averageScore: 4.7,
    ratingCount: 128,
  },
  {
    id: 2,
    name: "Sân Tây Hồ",
    address: "68 Võ Chí Công, Tây Hồ",
    courts: 4,
    status: "Hoạt động",
    averageScore: 4.6,
    ratingCount: 102,
  },
  {
    id: 3,
    name: "Sân Cầu Giấy",
    address: "35 Trần Thái Tông, Cầu Giấy",
    courts: 5,
    status: "Ngừng hoạt động",
    averageScore: 4.3,
    ratingCount: 85,
  },
];

export const ownerStatuses = [
  {
    id: 1,
    name: "Sân 12 Khuất Duy Tiến",
    todayBookings: 14,
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Sân Tây Hồ",
    todayBookings: 11,
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Sân Cầu Giấy",
    todayBookings: 8,
    status: "Ngừng hoạt động",
  },
];

export const ownerRevenues = [
  {
    id: 1,
    name: "Sân 12 Khuất Duy Tiến",
    monthRevenue: "60.000.000 đ",
    growth: "+12% MoM",
    topHour: "18:00 - 20:00",
  },
  {
    id: 2,
    name: "Sân Tây Hồ",
    monthRevenue: "45.000.000 đ",
    growth: "+7% MoM",
    topHour: "17:00 - 19:00",
  },
  {
    id: 3,
    name: "Sân Cầu Giấy",
    monthRevenue: "39.500.000 đ",
    growth: "+5% MoM",
    topHour: "16:00 - 18:00",
  },
];

export const ownerVenueDetails = [
  {
    id: 1,
    name: "Sân cầu lông đại học kiến trúc Hà Nội",
    address: "Km 10, Đường Nguyễn Trãi, Quận Thanh Xuân, TP Hà Nội",
    contact: "0987654321",
    openTime: "07:00 AM",
    closeTime: "11:00 PM",
    status: "Hoạt động",
    images: [
      "/venues/image1.webp",
      "/venues/image2.webp",
      "/venues/imge3.webp",
      "/venues/image1.webp",
    ],
    schedules: [
      { start: "07:00 AM", end: "10:00 AM", day: "Thứ 2", price: "50.000 VND" },
      { start: "05:00 PM", end: "07:00 PM", day: "Thứ 2", price: "50.000 VND" },
      { start: "08:00 PM", end: "09:00 PM", day: "Thứ 2", price: "100.000 VND" },
      { start: "09:00 PM", end: "11:00 PM", day: "Thứ 2", price: "70.000 VND" },
    ],
  },
  {
    id: 2,
    name: "Sân Tây Hồ",
    address: "68 Võ Chí Công, Tây Hồ, Hà Nội",
    contact: "0911222333",
    openTime: "06:00 AM",
    closeTime: "10:00 PM",
    status: "Hoạt động",
    images: ["/venues/37baef48823fbeff66b7f4c79d9769b6.jpg"],
    schedules: [
      { start: "06:00 AM", end: "09:00 AM", day: "Thứ 3", price: "60.000 VND" },
      { start: "05:00 PM", end: "07:00 PM", day: "Thứ 3", price: "70.000 VND" },
      { start: "08:00 PM", end: "10:00 PM", day: "Thứ 3", price: "90.000 VND" },
    ],
  },
];

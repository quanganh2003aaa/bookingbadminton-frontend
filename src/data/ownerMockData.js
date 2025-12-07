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

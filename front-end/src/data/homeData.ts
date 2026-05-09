export type NavItem = {
  label: string
  href: string
}

export type Destination = {
  city: string
  price: string
  image: string
}

export type Feature = {
  title: string
  description: string
  icon: string
}

export type BookingStep = {
  title: string
  description: string
}

export type Testimonial = {
  name: string
  role: string
  avatar: string
  quote: string
}

export const navItems: NavItem[] = [
  { label: 'Chuyến bay', href: '#' },
  { label: 'Vé của tôi', href: '#' },
  { label: 'Check-in', href: '#' },
  { label: 'Hỗ trợ', href: '#' },
]

export const destinations: Destination[] = [
  { city: 'Tokyo', price: 'Từ 2.900.000 VNĐ', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80' },
  { city: 'Paris', price: 'Từ 5.400.000 VNĐ', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80' },
  { city: 'Singapore', price: 'Từ 1.800.000 VNĐ', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80' },
  { city: 'Seoul', price: 'Từ 3.200.000 VNĐ', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=900&q=80' },
  { city: 'London', price: 'Từ 6.100.000 VNĐ', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80' },
  { city: 'Dubai', price: 'Từ 4.800.000 VNĐ', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80' },
]

export const features: Feature[] = [
  { title: 'Đặt vé nhanh', description: 'Thanh toán và nhận vé chỉ trong 60 giây với quy trình tối ưu.', icon: '⚡' },
  { title: 'Thanh toán an toàn', description: 'Hệ thống bảo mật đa lớp, hỗ trợ mọi phương thức quốc tế.', icon: '🛡️' },
  { title: 'Check-in online', description: 'Tiết kiệm thời gian tại sân bay với tính năng làm thủ tục trực tuyến.', icon: '🎧' },
  { title: 'Trải nghiệm premium', description: 'Dịch vụ mặt đất và trên không tiêu chuẩn 5 sao quốc tế.', icon: '💎' },
]

export const bookingSteps: BookingStep[] = [
  { title: 'Tìm chuyến bay', description: 'Chọn điểm đến và thời gian bay phù hợp.' },
  { title: 'Chọn ghế', description: 'Xem sơ đồ và chọn vị trí ngồi yêu thích.' },
  { title: 'Thanh toán', description: 'Đa dạng phương thức, an toàn và bảo mật.' },
  { title: 'Nhận vé', description: 'Vé điện tử được gửi qua email/SMS ngay lập tức.' },
  { title: 'Check-in', description: 'Hoàn tất thủ tục online và sẵn sàng cất cánh.' },
]

export const testimonials: Testimonial[] = [
  { name: 'Minh Hoàng', role: 'Doanh nhân', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', quote: 'Dịch vụ cực kỳ chuyên nghiệp. Tôi rất ấn tượng với tốc độ đặt vé và giao diện dễ sử dụng.' },
  { name: 'Khánh Linh', role: 'Travel Blogger', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80', quote: 'SkyVoyage thực sự mang lại trải nghiệm premium. Nhân viên hỗ trợ rất nhiệt tình khi cần đổi lịch bay.' },
  { name: 'Thành Nam', role: 'Giám đốc Marketing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', quote: 'Ứng dụng đặt vé rất tiện lợi, thông tin chuyến bay được cập nhật liên tục.' },
]

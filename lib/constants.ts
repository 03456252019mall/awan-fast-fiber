export const BUSINESS = {
  name: "Awan Fast Fiber",
  established: "May 1, 2021",
  founders: ["Shoaib Aslam Awan", "Shaban Aslam Awan"],
  father: "M. Aslam",
  family: "Awan family, Chak No. 481 JB",
  office: "Chak No. 481 JB, Botay Wali, Jhang/Shorkot, Pakistan",
  phone: "03456252019",
  whatsapp: "03456252019",
  email: "shoaibaslam6252@gmail.com",
  facebook: "https://www.facebook.com/share/1HWjAFcsdW/",
  instagram: "awanfastfiber481",
  tiktok: "awanfastfiber481",
  youtube: "awanfastfiber481",
  newConnectionPrice: 6500,
  operatesAs: "National Broadband — Powered by Cybernet"
};

export function whatsappLink(message: string) {
  const phone = "92" + BUSINESS.whatsapp.replace(/^0/, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

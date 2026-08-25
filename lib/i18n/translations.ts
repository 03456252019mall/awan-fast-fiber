export const translations = {
  en: {
    dir: "ltr",
    nav_home: "Home",
    nav_packages: "Packages",
    nav_coverage: "Coverage",
    nav_about: "About",
    nav_contact: "Contact",
    nav_faq: "FAQ",
    nav_new_connection: "Get New Connection",
    nav_login: "Login",
    nav_dashboard: "Dashboard",
    cta_new_connection: "Get New Connection",
    cta_check_coverage: "Check Availability",
    cta_complaint: "Submit Complaint",
    footer_rights: "All rights reserved.",
    footer_operates: "Operates as National Broadband — Powered by Cybernet"
  },
  ur: {
    dir: "rtl",
    nav_home: "ہوم",
    nav_packages: "پیکجز",
    nav_coverage: "کوریج",
    nav_about: "ہمارے بارے میں",
    nav_contact: "رابطہ",
    nav_faq: "سوالات",
    nav_new_connection: "نیا کنکشن حاصل کریں",
    nav_login: "لاگ ان",
    nav_dashboard: "ڈیش بورڈ",
    cta_new_connection: "نیا کنکشن حاصل کریں",
    cta_check_coverage: "دستیابی چیک کریں",
    cta_complaint: "شکایت درج کریں",
    footer_rights: "جملہ حقوق محفوظ ہیں۔",
    footer_operates: "نیشنل براڈ بینڈ کے نام سے کام کرتا ہے — سائبرنیٹ کی بینڈوتھ کے ساتھ"
  }
} as const;

export type Lang = keyof typeof translations;

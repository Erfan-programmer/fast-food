import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingCart,
  MapPin,
  Plus,
  Minus,
  X,
  Utensils,
  Star,
  Search,
  ChefHat,
  Bike,
  ArrowRight,
  Heart,
  Timer,
  Phone,
  MessageCircle,
  Instagram,
  Twitter,
  Linkedin,
  Headphones,
  User,
  LogOut,
  ChevronLeft,
  Clock
} from "lucide-react";

// ==========================================
// 0. GLOBAL STYLES & FONT
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;300;400;500;700;900&display=swap');
    
    body {
      font-family: 'Vazirmatn', sans-serif;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.33); }
      80%, 100% { opacity: 0; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }
  `}</style>
);

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface Product {
  id: number;
  name: string;
  price: number;
  ingredients: string;
  image: string;
  category: string;
  rating: number;
  time: string;
  calories?: number;
}

interface CartItem extends Product {
  qty: number;
}

interface Category {
  id: string;
  label: string;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  distance: string;
  isBest: boolean;
}

interface UserProfile {
  phone: string;
  name?: string;
}

// ==========================================
// 2. CONSTANTS & MOCK DATA
// ==========================================

const CATEGORIES: Category[] = [
  { id: "all", label: "همه" },
  { id: "kebab", label: "کباب سنتی" },
  { id: "stew", label: "خورشت‌ها" },
  { id: "rice", label: "پلوهای مخلوط" },
  { id: "appetizer", label: "پیش‌غذا" },
];

const MENU_ITEMS: Product[] = [
  {
    id: 1,
    name: "کباب کوبیده مخصوص",
    price: 250000,
    ingredients: "گوشت گوسفندی تازه، پیاز، سماق، گوجه کبابی، برنج ایرانی اعلا",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=60",
    category: "kebab",
    rating: 4.8,
    time: "20-30 دقیقه",
    calories: 850,
  },
  {
    id: 2,
    name: "جوجه کباب زعفرانی",
    price: 210000,
    ingredients: "سینه مرغ مرینیت شده، زعفران دم‌کرده، کره محلی، پلو زعفرانی",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=60",
    category: "kebab",
    rating: 4.6,
    time: "25 دقیقه",
    calories: 720,
  },
  {
    id: 3,
    name: "قرمه سبزی جاافتاده",
    price: 180000,
    ingredients: "سبزی کوهی معطر، گوشت گوساله تکه‌ای، لوبیا چیتی، لیمو عمانی",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=60",
    category: "stew",
    rating: 4.9,
    time: "آماده",
    calories: 600,
  },
  {
    id: 4,
    name: "زرشک پلو با مرغ مجلسی",
    price: 195000,
    ingredients: "ران مرغ سرخ شده، زرشک پفکی، خلال پسته و بادام، برنج هاشمی",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=60",
    category: "rice",
    rating: 4.5,
    time: "30 دقیقه",
    calories: 780,
  },
  {
    id: 5,
    name: "سالاد سزار با مرغ گریل",
    price: 140000,
    ingredients: "کاهو رسمی، فیله مرغ گریل، نان سیر، پنیر پارمزان، سس دست‌ساز",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=60",
    category: "appetizer",
    rating: 4.3,
    time: "15 دقیقه",
    calories: 350,
  },
  {
    id: 6,
    name: "باقالی پلو با ماهیچه",
    price: 450000,
    ingredients:
      "ماهیچه گوسفندی ۵۰۰ گرمی، باقالی تازه، شوید خشک، روغن کرمانشاهی",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=60",
    category: "rice",
    rating: 5.0,
    time: "45 دقیقه",
    calories: 950,
  },
];

const BRANCHES: Branch[] = [
  {
    id: 1,
    name: "شعبه مرکزی (جردن)",
    address: "تهران، جردن، تابان غربی",
    distance: "2.5 km",
    isBest: true,
  },
  {
    id: 2,
    name: "شعبه غرب (ستارخان)",
    address: "تهران، ستارخان، برق آلستوم",
    distance: "8.1 km",
    isBest: false,
  },
  {
    id: 3,
    name: "شعبه شرق (تهرانپارس)",
    address: "تهران، فلکه اول تهرانپارس",
    distance: "12 km",
    isBest: false,
  },
];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const PriceDisplay: React.FC<{ amount: number; className?: string }> = ({
  amount,
  className = "",
}) => (
  <span className={`font-bold tracking-tight text-gray-900 ${className}`}>
    {amount.toLocaleString("fa-IR")}{" "}
    <span className="text-[0.7em] font-normal text-gray-500">تومان</span>
  </span>
);

const Badge: React.FC<{
  children: React.ReactNode;
  color?: "red" | "green" | "gray" | "amber";
}> = ({ children, color = "gray" }) => {
  const styles = {
    red: "bg-red-50 text-red-600 border-red-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${styles[color]}`}
    >
      {children}
    </span>
  );
};

// کنترل تعداد دایره‌ای
interface QuantityControlProps {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  size?: "sm" | "md";
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  qty,
  onAdd,
  onRemove,
  size = "md",
}) => {
  const isSmall = size === "sm";
  const iconSize = isSmall ? 14 : 18;
  const btnClass = `rounded-full flex items-center justify-center transition-all shadow-sm border ${
    isSmall ? "w-7 h-7" : "w-9 h-9"
  }`;

  if (qty === 0) {
    return (
      <button
        onClick={onAdd}
        className={`bg-gray-900 hover:bg-black text-white rounded-full font-medium transition-all shadow-lg shadow-gray-300 active:scale-95 flex items-center justify-center gap-2 px-4 w-full ${isSmall ? "py-1.5 text-xs" : "py-2.5"}`}
      >
        <span>افزودن</span>
        <Plus size={iconSize} />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 w-full max-w-[140px] mx-auto">
      <button
        onClick={onAdd}
        className={`${btnClass} bg-white text-green-600 border-green-100 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-green-200`}
      >
        <Plus size={iconSize} />
      </button>

      <span
        className={`font-bold text-gray-900 ${isSmall ? "text-sm" : "text-lg"}`}
      >
        {qty.toLocaleString("fa-IR")}
      </span>

      <button
        onClick={onRemove}
        className={`${btnClass} bg-white text-red-500 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-red-200`}
      >
        <Minus size={iconSize} />
      </button>
    </div>
  );
};

// کامپوننت وضعیت رستوران (انیمیشن موج)
const RestaurantStatus: React.FC = () => {
  return (
    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100 shadow-sm">
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </div>
      <span>باز است • ۱۱:۰۰ تا ۲۳:۰۰</span>
    </div>
  );
};

// ==========================================
// 4. COMPLEX COMPONENTS
// ==========================================

const ProductCard: React.FC<{
  item: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}> = ({ item, qty, onAdd, onRemove }) => {
  return (
    <div className="group bg-white rounded-[24px] p-4 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 border border-gray-100 flex flex-col h-full relative overflow-hidden">
      {/* Image Section */}
      <div className="relative rounded-2xl overflow-hidden aspect-[1.4] mb-4 shadow-inner">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
          <Badge color="amber">
            <Star size={10} fill="currentColor" /> {item.rating}
          </Badge>
          <Badge color="gray">
            <Timer size={10} /> {item.time}
          </Badge>
        </div>
        <button className="absolute top-2 left-2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm active:scale-90">
          <Heart size={18} />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-extrabold text-gray-900 text-lg mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-500 text-sm leading-6 mb-4 line-clamp-2">
          {item.ingredients}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
            <span className="text-xs text-gray-400 font-medium">
              قیمت هر پرس:
            </span>
            <PriceDisplay amount={item.price} className="text-lg" />
          </div>
          <div className="w-full pt-1">
            <QuantityControl qty={qty} onAdd={onAdd} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSidebar: React.FC<{
  cart: CartItem[];
  total: number;
  onAdd: (item: Product) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}> = ({ cart, total, onAdd, onRemove, onCheckout }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 h-[calc(100vh-100px)] sticky top-24 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-white z-10">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-bold text-xl flex items-center gap-2 text-gray-900">
            <div className="bg-red-50 p-2.5 rounded-full text-red-600">
              <ShoppingCart size={22} />
            </div>
            سبد خرید
          </h2>
          <span className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-full shadow-md shadow-gray-200">
            {cart.reduce((acc, i) => acc + i.qty, 0).toLocaleString("fa-IR")}{" "}
            مورد
          </span>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-70">
            <div className="bg-gray-50 p-6 rounded-full border-2 border-dashed border-gray-200">
              <ChefHat size={48} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-gray-400">
              سبد خرید شما خالی است
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl transition-all group hover:bg-white hover:shadow-md"
            >
              <img
                src={item.image}
                alt=""
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white shadow-sm"
              />
              <div className="flex-grow flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-gray-800 line-clamp-1">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                    {item.calories} cal
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <PriceDisplay
                    amount={item.price * item.qty}
                    className="text-sm"
                  />
                  <div className="w-24 origin-left scale-90">
                    <QuantityControl
                      qty={item.qty}
                      onAdd={() => onAdd(item)}
                      onRemove={() => onRemove(item.id)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Summary */}
      <div className="p-5 bg-white border-t border-gray-200 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500 font-medium text-sm">
            مبلغ قابل پرداخت
          </span>
          <PriceDisplay amount={total} className="text-2xl text-gray-900" />
        </div>

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-gray-900/20"
        >
          <span>تکمیل سفارش</span>
          {cart.length > 0 && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-20 rounded-t-[40px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 p-2 rounded-xl">
                <Utensils size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                فست فود پلاس
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-7 max-w-sm mb-6">
              تجربه طعمی بی‌نظیر با مواد اولیه تازه و طبخ اصیل. ما در فست فود
              متعهد به ارائه بهترین کیفیت غذا با سریع‌ترین ارسال هستیم.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-red-500">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                "منوی رستوران",
                "درباره ما",
                "شعب ما",
                "قوانین و مقررات",
                "همکاری با ما",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white hover:pr-2 transition-all block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-red-500">تماس با ما</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-red-500 shrink-0" />
                تهران، جردن، خیابان تابان غربی، پلاک ۴۲
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-red-500 shrink-0" />
                024-2323323
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>© تمامی حقوق برای فست فود پلاس محفوظ است. ۱۴۰۳</p>
        </div>
      </div>
    </footer>
  );
};

const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-4 -translate-y-1/2 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-3 animate-fade-in-up origin-bottom-right mb-2">
          <button className="flex items-center gap-3 bg-white text-gray-800 px-4 py-2 rounded-full shadow-xl hover:bg-gray-50 transition-all border border-gray-100 group">
            <span className="font-bold text-sm">۰۲۱-۸۸۸۸۴۴۴۴</span>
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition">
              <Phone size={18} />
            </div>
          </button>

          <button className="flex items-center gap-3 bg-white text-gray-800 px-4 py-2 rounded-full shadow-xl hover:bg-gray-50 transition-all border border-gray-100 group">
            <span className="font-bold text-sm">چت آنلاین</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <MessageCircle size={18} />
            </div>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? "bg-red-600 rotate-45" : "bg-gray-900"} text-white border-4 border-white`}
      >
        {isOpen ? <Plus size={28} /> : <Headphones size={24} />}
      </button>
    </div>
  );
};

const BranchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
}> = ({ isOpen, onClose, branches }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="bg-white relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-l from-gray-900 to-gray-800 p-6 flex justify-between items-start">
          <div className="text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin size={20} className="text-red-500" /> انتخاب شعبه
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              نزدیک‌ترین شعبه را برای غذای گرم‌تر انتخاب کنید
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3 bg-gray-50">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className={`group flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${branch.isBest ? "border-red-500 bg-white shadow-md" : "border-white bg-white hover:border-red-200"}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${branch.isBest ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500"}`}
              >
                <MapPin size={24} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {branch.name}
                  </h4>
                  {branch.isBest && (
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={8} fill="white" />
                      پیشنهاد
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{branch.address}</p>
              </div>
              <div className="text-right pl-2">
                <div className="text-sm font-black text-gray-800 flex items-center gap-1 justify-end font-mono">
                  <Bike size={14} className="text-gray-400" />
                  {branch.distance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. LOGIN MODAL
// ==========================================

const LoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (phone: string) => void;
}> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhoneNumber("");
      setOtp("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 11 && phoneNumber.startsWith("09")) {
      setStep("otp");
    } else {
      alert("لطفا شماره موبایل معتبر وارد کنید");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(phoneNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="bg-white relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={32} />
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2">
            {step === "phone" ? "ورود / ثبت‌نام" : "کد تایید"}
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            {step === "phone"
              ? "برای ادامه شماره همراه خود را وارد کنید"
              : `کد تایید به شماره ${phoneNumber} ارسال شد`}
          </p>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="relative mb-6">
                <Phone className="absolute right-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder="شماره موبایل (مثلا ۰۹۱۲۳۴۵۶۷۸۹)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 rounded-2xl py-3 pr-12 pl-4 outline-none text-left font-bold text-lg dir-ltr placeholder:text-right"
                  maxLength={11}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/20"
              >
                ارسال کد تایید
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
               <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-bold mb-6 border border-amber-100">
                  این نسخه دمو است، کد تایید ارسال نمی‌شود.
                  <br/>
                  (هر کدی وارد کنید قبول می‌شود)
               </div>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="- - - -"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 rounded-2xl py-3 text-center tracking-[1em] font-bold text-2xl outline-none"
                  maxLength={4}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                 <button
                   type="button"
                   onClick={() => setStep("phone")}
                   className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                 >
                   <ChevronLeft size={20} className="mx-auto" />
                 </button>
                 <button
                   type="submit"
                   className="flex-[3] bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/20"
                 >
                   ورود به حساب
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 7. MAIN APP COMPONENT
// ==========================================

export default function FoodOrderApp() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user, setUser] = useState<UserProfile | null>(null);

  // Handlers
  const addToCart = (item: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing?.qty === 1) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) => (i.id === itemId ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const getItemQty = (id: number) => cart.find((i) => i.id === id)?.qty || 0;
  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart],
  );

  const handleLogin = (phone: string) => {
    setUser({ phone });
    setIsLoginModalOpen(false);
  };

  const handleCheckout = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      alert("سفارش شما با موفقیت ثبت شد!");
    }
  };

  const handleLogout = () => {
     setUser(null);
  };

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-[#F8F9FA] text-gray-800" dir="rtl">
        {/* Navbar */}
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Right Side: Logo & Status */}
            <div className="flex items-center justify-between w-full md:w-auto gap-6">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="bg-red-600 text-white p-2.5 rounded-2xl shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform">
                  <Utensils size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 tracking-tight">
                    فست فود پلاس
                  </h1>
                </div>
              </div>
              
              <div className="hidden md:block">
                 <RestaurantStatus />
              </div>

              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="md:hidden bg-gray-100 p-2 rounded-full text-gray-600"
              >
                <MapPin size={20} />
              </button>
            </div>

            {/* Middle: Search */}
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="جستجو در منو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent focus:bg-white focus:border-red-500 rounded-2xl py-3 pr-12 pl-4 transition-all outline-none text-sm font-medium placeholder-gray-400"
              />
            </div>

            {/* Left Side: Branch & Profile */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="bg-white border-2 border-gray-100 hover:border-red-200 hover:bg-red-50 text-gray-700 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <MapPin size={18} className="text-red-600" />
                انتخاب شعبه
              </button>

              {user ? (
                 <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-2xl cursor-default">
                    <div className="flex flex-col text-left">
                       <span className="text-[10px] text-gray-400 font-bold">خوش آمدید</span>
                       <span className="text-xs font-bold font-mono dir-ltr">{user.phone}</span>
                    </div>
                    <button onClick={handleLogout} className="bg-gray-800 p-1 rounded-full hover:bg-red-600 transition ml-1" title="خروج">
                       <LogOut size={14} />
                    </button>
                 </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gray-900 text-white px-4 py-2.5 rounded-2xl font-bold text-sm transition-all hover:bg-black flex items-center gap-2 shadow-lg shadow-gray-900/10"
                >
                  <User size={18} />
                  ورود / ثبت‌نام
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Menu Area */}
            <div className="lg:w-3/4 order-2 lg:order-1">
              {/* Promo Banner */}
              <div className="bg-gray-900 rounded-[30px] p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-lg">
                  <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    پیشنهاد ویژه
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">
                    ۲۰٪ تخفیف روی سفارش‌های
                    <br />
                    شام امشب!
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    بهترین غذاها را با کیفیت عالی و ارسال سریع تجربه کنید.
                  </p>
                </div>
                <div className="absolute -left-10 -bottom-20 w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-40"></div>
              </div>

              {/* Categories */}
              <div className="sticky top-20 z-30 bg-[#F8F9FA] pb-4 -mt-2 pt-2">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`snap-center px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-bold transition-all border shadow-sm ${
                        activeCategory === cat.id
                          ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105"
                          : "bg-white text-gray-500 border-white hover:border-gray-200 hover:text-gray-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      qty={getItemQty(item.id)}
                      onAdd={() => addToCart(item)}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-200 p-6 rounded-full mb-4">
                    <Search size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">
                    نتیجه‌ای یافت نشد
                  </h3>
                </div>
              )}
            </div>

            {/* Cart Area */}
            <div className="lg:w-1/4 order-1 lg:order-2">
              <CartSidebar
                cart={cart}
                total={cartTotal}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Support Widget */}
        <SupportWidget />

        {/* Branch Modal */}
        <BranchModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          branches={BRANCHES}
        />

        {/* Login Modal */}
        <LoginModal 
           isOpen={isLoginModalOpen}
           onClose={() => setIsLoginModalOpen(false)}
           onLogin={handleLogin}
        />
      </div>
    </>
  );
}
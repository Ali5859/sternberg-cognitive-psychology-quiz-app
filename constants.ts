import { Chapter, Difficulty } from './types';
import BookOpenIcon from './components/icons/BookOpenIcon';
import BrainCircuitIcon from './components/icons/BrainCircuitIcon';
import LightBulbIcon from './components/icons/LightBulbIcon';

export const QUIZ_QUESTION_COUNT = 10;

export const DIFFICULTIES: { id: Difficulty, label: string }[] = [
    { id: Difficulty.EASY, label: 'آسان' },
    { id: Difficulty.MEDIUM, label: 'متوسط' },
    { id: Difficulty.HARD, label: 'سخت' },
];

export const QUIZ_DURATIONS: { [key in Difficulty]: number } = {
    [Difficulty.EASY]: 420, // 7 minutes
    [Difficulty.MEDIUM]: 300, // 5 minutes
    [Difficulty.HARD]: 240, // 4 minutes
};


export const CHAPTERS: Chapter[] = [
    {
        id: 1,
        title: "مقدمه‌ای بر روانشناسی شناختی",
        description: "مبانی و تاریخچه روانشناسی شناختی.",
        icon: BookOpenIcon,
    },
    {
        id: 2,
        "title": "ادراک",
        "description": "چگونگی تفسیر اطلاعات حسی توسط مغز.",
        "icon": BrainCircuitIcon
    },
    {
        id: 3,
        "title": "توجه و آگاهی",
        "description": "فرآیندهای انتخاب و تمرکز بر محرک‌ها.",
        "icon": LightBulbIcon
    },
    {
        id: 4,
        "title": "حافظه: مدل‌ها و روش‌ها",
        "description": "ساختارها و انواع مختلف سیستم حافظه.",
        "icon": BookOpenIcon
    },
    {
        id: 5,
        "title": "فرآیندهای حافظه",
        "description": "رمزگذاری، ذخیره‌سازی و بازیابی اطلاعات.",
        "icon": BrainCircuitIcon
    },
    {
        id: 6,
        "title": "بازنمایی دانش",
        "description": "نحوه سازماندهی اطلاعات در ذهن.",
        "icon": LightBulbIcon
    },
    {
        id: 7,
        "title": "زبان",
        "description": "درک، تولید و اکتساب زبان.",
        "icon": BookOpenIcon
    },
    {
        id: 8,
        "title": "حل مسئله و خلاقیت",
        "description": "استراتژی‌های شناختی برای حل مشکلات.",
        "icon": BrainCircuitIcon
    },
    {
        id: 9,
        "title": "تصمیم‌گیری و استدلال",
        "description": "فرآیندهای قضاوت و انتخاب منطقی.",
        "icon": LightBulbIcon
    }
];
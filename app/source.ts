import { docs, meta } from '../.source/server';
import { loader } from 'fumadocs-core/source';
import { createElement } from 'react';
import {
    Book, Sparkles, Wrench, Rocket, Info, Coins, Network,
    DollarSign, MessageSquare, Wallet, Send, Users, Activity,
    Check, Contact, RefreshCw, Search, ArrowRightLeft,
    TrendingUp, Image, FileCode, BarChart3, BookOpen
} from 'lucide-react';

const iconMap = {
    Book,
    Sparkles,
    Tools: Wrench,
    Rocket,
    Info,
    Coins,
    Network,
    DollarSign,
    MessageSquare,
    Wallet,
    Send,
    Users,
    Activity,
    Check,
    Contact,
    RefreshCw,
    Search,
    ArrowRightLeft,
    TrendingUp,
    Image,
    FileCode,
    BarChart3,
    BookOpen,
};

const mapFile = (file: any, type: 'page' | 'meta') => {
    return {
        type,
        path: file.info?.path || file.path,
        data: file,
    };
};

export const source = loader({
    baseUrl: '/docs',
    source: {
        files: [
            ...(Array.isArray(docs) ? docs.map(d => mapFile(d, 'page')) : []),
            ...(Array.isArray(meta) ? meta.map(m => mapFile(m, 'meta')) : []),
        ],
    },
    icon(icon) {
        if (icon && icon in iconMap) {
            const IconComponent = iconMap[icon as keyof typeof iconMap];
            return createElement(IconComponent, { className: 'w-4 h-4' });
        }
    },
});

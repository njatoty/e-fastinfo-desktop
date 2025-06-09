import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  AlertTriangle,
  History,
  Settings,
} from 'lucide-react';

export function useNavGroups() {
  const { t } = useTranslation();

  const navGroups = [
    {
      title: t('nav.general'),
      items: [
        {
          title: t('nav.dashboard'),
          href: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: t('nav.management'),
      items: [
        {
          title: t('nav.products'),
          href: '/products',
          icon: Package,
        },
        {
          title: t('nav.categories'),
          href: '/categories',
          icon: Tag,
        },
        {
          title: t('nav.staff'),
          href: '/staff',
          icon: Users,
        },
      ],
    },
    {
      title: t('nav.inventory'),
      items: [
        {
          title: t('nav.lowStock'),
          href: '/low-stock',
          icon: AlertTriangle,
        },
        {
          title: t('nav.stockMovements'),
          href: '/stock-movements',
          icon: History,
        },
      ],
    },
    {
      title: t('nav.settingsGroup'),
      items: [
        {
          title: t('nav.settings'),
          href: '/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return navGroups;
}

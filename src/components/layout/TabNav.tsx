import { NavLink } from 'react-router-dom';
import Icon from '../icons/Icon';
import { useI18n } from '../../i18n/I18nContext';
import './TabNav.css';

const tabs: {
  to: string;
  labelKey: string;
  icon: 'play' | 'hash' | 'flame' | 'board';
}[] = [
  { to: '/', labelKey: 'tab.videos', icon: 'play' },
  { to: '/keywords', labelKey: 'tab.keywords', icon: 'hash' },
  { to: '/channels', labelKey: 'tab.channels', icon: 'flame' },
  { to: '/board', labelKey: 'tab.board', icon: 'board' },
];

export default function TabNav() {
  const { t } = useI18n();
  return (
    <nav className="tab-nav" aria-label="Main">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `tab-nav__item${isActive ? ' is-active' : ''}`
          }
        >
          <Icon name={tab.icon} />
          {t(tab.labelKey)}
        </NavLink>
      ))}
    </nav>
  );
}

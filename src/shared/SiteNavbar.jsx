import React, { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './SiteNavbar.css';

const CapIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M12 3 1.5 8.4 12 13.8 22.5 8.4 12 3Z"
      fill="#2F5FA7"
      opacity="0.95"
    />
    <path
      d="M5.5 10.2v4.6c0 1.8 3 3.6 6.5 3.6s6.5-1.8 6.5-3.6v-4.6l-6.5 3.3-6.5-3.3Z"
      fill="#2F5FA7"
      opacity="0.75"
    />
    <path
      d="M22.5 8.4v6.1"
      stroke="#2F5FA7"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

const SiteNavbar = () => {
  const links = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Career Paths', to: '/career-paths' },
      { label: 'Concept Hub', to: '/concept-hub' },
      { label: 'Career Advice', to: '/#career-advice' },
      { label: 'Resources', to: '/#resources' },
      { label: 'About', to: '/#about' },
    ],
    []
  );

  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link className="nav__brand" to="/" onClick={() => setOpen(false)}>
          <CapIcon />
          <span className="nav__brandText">
            <span className="nav__brandBold">Beyond</span>{' '}
            <span className="nav__brandScript">the degree</span>
          </span>
        </Link>

        <div className="nav__links" role="navigation" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
              to={l.to}
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="nav__right">
          <Link className="btn btn--primary nav__cta" to="/career-paths">
            Get Started
          </Link>
          <button
            className="nav__hamburger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`navMobile ${open ? 'navMobile--open' : ''}`}>
        <div className="container navMobile__inner">
          {links.map((l) => (
            <Link key={l.to} className="navMobile__link" to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link className="btn btn--primary navMobile__cta" to="/career-paths" onClick={() => setOpen(false)}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default SiteNavbar;


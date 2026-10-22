import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { Calendar, Building2, Sparkles, UserCheck } from 'lucide-react';

import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CampusServices from './pages/CampusServices';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        {/* Topbar / Navigation */}
        <header
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {/* Logo & Brand */}
            <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  VYNORA <span style={{ color: 'var(--accent)' }}>CONNECT</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                  Explore Beyond Campus
                </div>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <NavLink
                to="/events"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                })}
              >
                <Calendar size={15} />
                <span>Events</span>
              </NavLink>

              <NavLink
                to="/campus-services"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                })}
              >
                <Building2 size={15} />
                <span>Campus Services</span>
              </NavLink>
            </nav>

            {/* User Session Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}
            >
              <UserCheck size={14} color="#34D399" />
              <span>Sindhu</span>
              <span style={{ color: '#525252' }}>|</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Campus & Events</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Pages */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/campus-services" element={<CampusServices />} />
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-sidebar)',
            padding: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
        >
          Vynora Connect — Cross-College Student Community Platform • Week 1 Events Foundation
        </footer>
      </div>
    </BrowserRouter>
  );
}
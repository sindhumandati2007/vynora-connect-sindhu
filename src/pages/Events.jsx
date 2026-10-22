import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import { eventsService } from '../services/eventsService';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlineOnly, setOnlineOnly] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.getEvents({
        category: selectedCategory,
        search,
        onlineOnly
      });
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Unable to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, search, onlineOnly]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Calendar size={20} color="var(--accent)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Campus & Events Discovery
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Explore Student Activities
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Discover workshops, hackathons, technical seminars, and meetups from universities across our network.
        </p>
      </div>

      {/* Filter Component */}
      <EventFilters
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onlineOnly={onlineOnly}
        setOnlineOnly={setOnlineOnly}
        totalCount={events.length}
      />

      {/* Content Area */}
      {loading ? (
        /* Loading Skeleton */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              style={{
                height: '240px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                opacity: 0.6
              }}
            />
          ))}
        </div>
      ) : error ? (
        /* Error State with Retry */
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid #EF4444',
            borderRadius: '12px',
            padding: '36px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertCircle size={36} color="#EF4444" />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Failed to Load Events</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px' }}>{error}</p>
          <button
            onClick={fetchEvents}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px'
            }}
          >
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '48px 20px',
            textAlign: 'center'
          }}
        >
          <Calendar size={42} color="#737373" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No events found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            No events match your current filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setOnlineOnly(false);
            }}
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Event Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
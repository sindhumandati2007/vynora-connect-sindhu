import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, ShieldCheck, Tag } from 'lucide-react';
import EventStatusBadge from '../components/events/EventStatusBadge';
import EventRegistration from '../components/events/EventRegistration';
import { eventsService } from '../services/eventsService';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.getEventById(id);
      setEvent(data);
    } catch (err) {
      setError(err.message || 'Event not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: 'var(--text-secondary)' }}>
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '14px', marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Event Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{error || 'This event does not exist or has been removed.'}</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  });
  const endDate = new Date(event.endAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  });
  const deadline = new Date(event.registrationDeadline).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const percentageFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Back button */}
      <Link
        to="/events"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={16} /> Back to all events
      </Link>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}
      >
        {/* Header Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--accent)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              {event.category}
            </span>
            <EventStatusBadge status={event.status} isOnline={event.isOnline} />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {event.title}
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Organized by <strong style={{ color: '#FFFFFF' }}>{event.organizer}</strong>
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Left Column: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Start and End Times */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Calendar size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Start Date & Time</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{startDate}</div>
                <div style={{ fontSize: '12px', color: '#737373', marginTop: '2px' }}>Ends: {endDate}</div>
              </div>
            </div>

            {/* Location / Meeting */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Location</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{event.location}</div>
              </div>
            </div>

            {/* Deadline */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Clock size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Registration Deadline</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{deadline}</div>
              </div>
            </div>

            {/* Eligibility */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldCheck size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Eligibility</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{event.eligibility}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card + Capacity Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <EventRegistration
              event={event}
              onRegistrationChange={(isRegistered) => {
                setEvent((prev) => ({
                  ...prev,
                  isUserRegistered: isRegistered,
                  registeredCount: isRegistered ? prev.registeredCount + 1 : prev.registeredCount - 1
                }));
              }}
            />

            {/* Capacity Meter */}
            <div style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Capacity Filled</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {event.registeredCount} / {event.capacity} seats ({percentageFilled}%)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#262626', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percentageFilled}%`,
                    backgroundColor: percentageFilled >= 100 ? '#EF4444' : 'var(--accent)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>About this Event</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {event.description}
          </p>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Tag size={15} color="#737373" />
            {event.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '12px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
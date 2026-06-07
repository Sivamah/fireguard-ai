import React from 'react';

export const Skeleton = ({ width, height, borderRadius = 'var(--radius-md)', style }) => (
  <div style={{
    width: width || '100%',
    height: height || 20,
    borderRadius,
    background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-light) 50%, var(--bg-secondary) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
    ...style
  }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export const SkeletonCard = () => (
  <div className="card" style={{ padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <Skeleton width={48} height={48} borderRadius="50%" />
      <div>
        <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height={14} />
      <Skeleton height={14} />
      <Skeleton width="80%" height={14} />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="grid grid-3" style={{ gap: 20, padding: 32 }}>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <div className="col-span-3">
      <Skeleton height={300} borderRadius="var(--radius-lg)" />
    </div>
  </div>
);

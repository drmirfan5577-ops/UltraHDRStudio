import React from 'react';

const Waveform: React.FC<{ bars?: number; active?: boolean }> = ({ bars = 12, active = true }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: bars }).map((_, i) => (
      <div
        key={i}
        className="waveform-bar"
        style={{
          animationDelay: `${i * 0.09}s`,
          opacity: active ? 1 : 0.3,
        }}
      />
    ))}
  </div>
);

export default Waveform;

// components.js — restyled to match Yepper design system
import React from 'react';
import { Loader2 } from 'lucide-react';
import Loading from './LoadingSpinner';

/* ── Button ── */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  ...props
}) => {
  const variantMap = {
    primary:   'yp-btn yp-btn-ghost',
    secondary: 'yp-btn yp-btn-solid',
    orange:    'yp-btn yp-btn-orange',
    outline:   'yp-btn yp-btn-ghost',
    ghost:     'yp-btn yp-btn-paper',
    danger:    'yp-btn',
    success:   'yp-btn',
  };

  const dangerStyle  = variant === 'danger'  ? { background:'#ef4444', color:'#fff', borderColor:'#ef4444' } : {};
  const successStyle = variant === 'success' ? { background:'#22c55e', color:'#fff', borderColor:'#22c55e' } : {};

  const sizeMap = {
    xs: 'yp-btn-sm',
    sm: 'yp-btn-sm',
    md: '',
    lg: 'yp-btn-lg',
    xl: 'yp-btn-lg',
  };

  const IconComponent = loading ? Loader2 : icon;

  return (
    <button
      className={`${variantMap[variant] || 'yp-btn yp-btn-ghost'} ${sizeMap[size]} ${className}`}
      style={{ ...dangerStyle, ...successStyle }}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && IconComponent && (
        <IconComponent
          size={size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16}
          className={`${loading ? 'animate-spin' : ''} ${children ? 'mr-2' : ''}`}
        />
      )}
      {children}
      {iconPosition === 'right' && IconComponent && (
        <IconComponent
          size={size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16}
          className={`${loading ? 'animate-spin' : ''} ${children ? 'ml-2' : ''}`}
        />
      )}
    </button>
  );
};

/* ── Card ── */
export const Card = ({ children, className = '', ...props }) => (
  <div className={`yp-card ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4`} style={{ borderBottom: '1px solid var(--yp-line)' }}
    {...props}>{children}</div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>{children}</div>
);

/* ── Typography ── */
export const Heading = ({ level = 1, children, className = '', ...props }) => {
  const base = 'yp-bricolage';
  const styles = {
    1: `${base} text-5xl font-bold`,
    2: `${base} text-3xl font-bold`,
    3: `${base} text-xl font-semibold`,
    4: `${base} text-lg font-semibold`,
    5: `${base} text-base font-semibold`,
    6: `${base} text-sm font-semibold`,
  };
  return React.createElement(`h${level}`, {
    className: `${styles[level]} ${className}`,
    style: { color: 'var(--yp-ink)', letterSpacing: '-.02em' },
    ...props,
  }, children);
};

export const Text = ({ variant = 'body', children, className = '', ...props }) => {
  const variants = {
    body:    'text-sm',
    small:   'text-xs',
    large:   'text-base',
    muted:   'text-sm',
    error:   'text-sm',
    success: 'text-sm',
  };
  const colorMap = {
    body:    'var(--yp-ink)',
    small:   'var(--yp-ink-soft)',
    large:   'var(--yp-ink)',
    muted:   'var(--yp-ink-soft)',
    error:   '#ef4444',
    success: '#22c55e',
  };
  return (
    <p className={`${variants[variant]} ${className}`}
      style={{ color: colorMap[variant] }} {...props}>
      {children}
    </p>
  );
};

/* ── Input ── */
export const Input = ({ label, error, helperText, className = '', required = false, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
        color: 'var(--yp-ink)', marginBottom: 4 }}>
        {label}{required && <span style={{ color: 'var(--yp-orange)', marginLeft: 3 }}>*</span>}
      </label>
    )}
    <input
      className={`yp-input ${error ? 'error' : ''} ${className}`}
      {...props}
    />
    {error      && <Text variant="error">{error}</Text>}
    {helperText && !error && <Text variant="muted">{helperText}</Text>}
  </div>
);

/* ── TextArea ── */
export const TextArea = ({ label, error, helperText, className = '', required = false, rows = 3, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--yp-ink)', marginBottom: 4 }}>
        {label}{required && <span style={{ color: 'var(--yp-orange)', marginLeft: 3 }}>*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className={`yp-input ${error ? 'error' : ''} ${className}`}
      style={{ resize: 'vertical' }}
      {...props}
    />
    {error      && <Text variant="error">{error}</Text>}
    {helperText && !error && <Text variant="muted">{helperText}</Text>}
  </div>
);

/* ── Select ── */
export const Select = ({ label, error, helperText, className = '', required = false, children, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--yp-ink)', marginBottom: 4 }}>
        {label}{required && <span style={{ color: 'var(--yp-orange)', marginLeft: 3 }}>*</span>}
      </label>
    )}
    <select className={`yp-input ${error ? 'error' : ''} ${className}`} {...props}>
      {children}
    </select>
    {error      && <Text variant="error">{error}</Text>}
    {helperText && !error && <Text variant="muted">{helperText}</Text>}
  </div>
);

/* ── Badge ── */
export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const styles = {
    default: { background: 'var(--yp-ink)', color: '#fff' },
    primary: { background: 'var(--yp-paper)', color: 'var(--yp-ink)', border: '1px solid var(--yp-line)' },
    success: { background: '#dcfce7', color: '#166534' },
    warning: { background: '#fef9c3', color: '#854d0e' },
    danger:  { background: '#fee2e2', color: '#991b1b' },
    info:    { background: '#dbeafe', color: '#1e40af' },
    orange:  { background: 'rgba(255,106,26,.12)', color: 'var(--yp-orange-deep)',
               border: '1px solid rgba(255,106,26,.25)' },
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${className}`}
      style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.04em', ...styles[variant] }}
      {...props}
    >
      {children}
    </span>
  );
};

/* ── LoadingSpinner ── */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8', xl: 'h-12 w-12' };
  return <Loading className={`animate-spin text-gray-600 ${sizes[size]} ${className}`} />;
};

/* ── Alert ── */
export const Alert = ({ children, variant = 'info', className = '', ...props }) => {
  const styles = {
    info:    { background: 'var(--yp-ink)', color: '#fff', borderColor: 'var(--yp-ink)' },
    success: { background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' },
    warning: { background: '#fffbeb', color: '#92400e', borderColor: '#fde68a' },
    error:   { background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' },
    orange:  { background: 'rgba(255,106,26,.08)', color: 'var(--yp-orange-deep)',
               borderColor: 'rgba(255,106,26,.25)' },
  };
  return (
    <div
      className={`border px-4 py-3 text-sm rounded-xl ${className}`}
      style={styles[variant]}
      {...props}
    >
      {children}
    </div>
  );
};

/* ── Container ── */
export const Container = ({ children, size = 'default', className = '', ...props }) => {
  const maxWidths = { sm: 896, default: 1200, lg: 9999 };
  return (
    <div style={{ maxWidth: maxWidths[size], margin: '0 auto', padding: '0 6vw' }}
      className={className} {...props}>
      {children}
    </div>
  );
};

/* ── Grid ── */
export const Grid = ({ children, cols = 1, gap = 4, className = '', ...props }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };
  const gaps = { 2: 'gap-2', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' };
  return (
    <div className={`grid ${gridCols[cols]} ${gaps[gap]} ${className}`} {...props}>
      {children}
    </div>
  );
};

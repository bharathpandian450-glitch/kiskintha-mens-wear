export function CrownIcon({ size = 34, className = '' }) {
    return (
        <svg
            className={`crown-svg-icon ${className}`}
            width={size}
            height={size}
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
        >
            {/* Ambient outer subtle ring */}
            <circle cx="18" cy="18" r="16.5" stroke="url(#crownGoldRing)" strokeWidth="1.2" opacity="0.85" />
            
            {/* Luxury obsidian shield background */}
            <circle cx="18" cy="18" r="14" fill="url(#crownBgDark)" />
            
            {/* Base platform */}
            <rect x="9.5" y="24" width="17" height="2.5" rx="1.2" fill="url(#crownGoldGrad)" />
            <line x1="10.5" y1="24.5" x2="25.5" y2="24.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
            
            {/* 5-Peak Crown Silhouette */}
            <path
                d="M9.5 22.5 L7.5 12.5 L12.5 17.5 L18 8.5 L23.5 17.5 L28.5 12.5 L26.5 22.5 H9.5 Z"
                fill="url(#crownGoldGrad)"
                stroke="url(#crownGoldStroke)"
                strokeWidth="0.8"
                strokeLinejoin="round"
            />
            
            {/* Peak Jewels / Accents */}
            <circle cx="7.5" cy="12" r="1.2" fill="#fffef0" />
            <circle cx="18" cy="8" r="1.4" fill="#fffef0" />
            <circle cx="28.5" cy="12" r="1.2" fill="#fffef0" />
            <circle cx="12.5" cy="17" r="0.9" fill="#fef08a" opacity="0.9" />
            <circle cx="23.5" cy="17" r="0.9" fill="#fef08a" opacity="0.9" />

            {/* Gradient definitions */}
            <defs>
                <linearGradient id="crownGoldGrad" x1="7.5" y1="8" x2="28.5" y2="25" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="35%" stopColor="#fef08a" />
                    <stop offset="70%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="crownGoldRing" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="crownGoldStroke" x1="7.5" y1="8" x2="28.5" y2="25" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="crownBgDark" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function CrownLogo({ layout = 'horizontal', iconSize = 34, showSubtext = true }) {
    return (
        <div className={`brand-header-logo-wrap layout-${layout}`}>
            <div className="crown-icon-badge">
                <CrownIcon size={iconSize} />
            </div>
            <div className="brand-title-group">
                <span className="brand-name-main">KISKINTHA</span>
                {showSubtext && <span className="brand-name-sub">MENS WEAR</span>}
            </div>
        </div>
    );
}

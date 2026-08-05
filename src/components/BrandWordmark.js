function BrandWordmark() {
  return (
    <div className="w-full relative">
      <svg viewBox="0 0 1400 300" className="w-full h-auto" preserveAspectRatio="xMidYMax meet">
        <text
          x="700"
          y="230"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="700"
          fontSize="200"
          fill="#FFFFFF"
          lengthAdjust="spacingAndGlyphs"
          textLength="1360"
        >
          budgetravel
        </text>

        {/* ground line */}
        <line x1="20" y1="255" x2="1380" y2="255" stroke="#FFCC94" strokeWidth="6" strokeLinecap="round" />

        {/* small house tucked near the "b" counter */}
        <g transform="translate(38, 150) scale(0.55)">
          <path d="M50 15 L85 42 L85 82 C85 84 83 86 81 86 L60 86 L60 58 L40 58 L40 86 L19 86 C17 86 15 84 15 82 L15 42 Z" fill="#FFCC94" />
          <rect x="43" y="66" width="14" height="20" rx="1.5" fill="#E35F00" />
        </g>

        {/* small sun near the "g" counter */}
        <circle cx="480" cy="175" r="18" fill="#FFCC94" />
      </svg>
    </div>
  );
}

export default BrandWordmark;
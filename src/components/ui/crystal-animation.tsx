export function CrystalAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="crystal-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="crystal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-400"
            >
              <path
                d="M10 2L14 8H6L10 2Z"
                fill="currentColor"
                opacity="0.8"
              />
              <path
                d="M14 8H6L2 14L10 18L18 14L14 8Z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M10 18L6 8L10 2L14 8L10 18Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </div>
        ))}
      </div>
      <style>{`
        .crystal-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .crystal {
          position: absolute;
          animation: float-crystal linear infinite;
        }
        @keyframes float-crystal {
          0% {
            transform: translateY(100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default CrystalAnimation

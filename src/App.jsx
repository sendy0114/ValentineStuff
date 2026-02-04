import React, { useState, useEffect } from 'react';

export default function ValentineApp() {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState(null); // null means static position
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [hearts, setHearts] = useState([]);
  const [noClickCount, setNoClickCount] = useState(0);
  const [rejected, setRejected] = useState(false);

  // Generate falling hearts for celebration page
  useEffect(() => {
    if (accepted) {
      const interval = setInterval(() => {
        const newHeart = {
          id: Math.random(),
          left: Math.random() * 100,
          animationDuration: 3 + Math.random() * 2,
          size: 20 + Math.random() * 20
        };
        setHearts(prev => [...prev, newHeart]);

        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 5000);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [accepted]);

  const moveNoButton = (e) => {
    e.preventDefault();

    // Prevent double-counting on mobile (touchstart + click)
    // and desktop (mouseenter + click) by using a timestamp check
    const now = Date.now();
    if (window.lastNoInteraction && now - window.lastNoInteraction < 300) {
      // Just move the button without incrementing the count
      moveButtonLogic();
      return;
    }
    window.lastNoInteraction = now;

    // Increment no click count
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);

    // Check if user clicked No 11 times
    if (newCount >= 11) {
      setRejected(true);
      return;
    }

    moveButtonLogic();
  };

  const moveButtonLogic = () => {
    // Calculate Yes button size changes (oscillate between smaller and larger)
    setYesButtonSize(prev => {
      if (prev >= 1.8) return 0.8; // Make it smaller when too big
      return Math.min(prev + 0.2, 2);
    });

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Define safe zones (avoid Yes button area and edges)
    const buttonWidth = 120;
    const buttonHeight = 60;
    const margin = 20;

    // Yes button is typically centered, so avoid center area
    const centerZoneWidth = viewportWidth * 0.4;
    const centerZoneHeight = viewportHeight * 0.3;
    const centerZoneLeft = (viewportWidth - centerZoneWidth) / 2;
    const centerZoneTop = (viewportHeight - centerZoneHeight) / 2;

    let newLeft, newTop;
    let attempts = 0;
    const maxAttempts = 50;

    // Try to find a position that doesn't overlap with Yes button
    do {
      newLeft = Math.random() * (viewportWidth - buttonWidth - margin * 2) + margin;
      newTop = Math.random() * (viewportHeight - buttonHeight - margin * 2) + margin;
      attempts++;
    } while (
      attempts < maxAttempts &&
      newLeft < centerZoneLeft + centerZoneWidth &&
      newLeft + buttonWidth > centerZoneLeft &&
      newTop < centerZoneTop + centerZoneHeight &&
      newTop + buttonHeight > centerZoneTop
    );

    // Fallback to corners if can't find safe position
    if (attempts >= maxAttempts) {
      const corners = [
        { left: margin, top: margin },
        { left: viewportWidth - buttonWidth - margin, top: margin },
        { left: margin, top: viewportHeight - buttonHeight - margin },
        { left: viewportWidth - buttonWidth - margin, top: viewportHeight - buttonHeight - margin }
      ];
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      newLeft = randomCorner.left;
      newTop = randomCorner.top;
    }

    setNoButtonPosition({
      left: `${newLeft}px`,
      top: `${newTop}px`
    });
  };

  const handleYesClick = () => {
    setAccepted(true);
  };

  // Rejection Page - Show after 11 No clicks
  if (rejected) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #1a1a1a 40%, #000000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Intelligent background effects */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {/* Falling broken hearts with varying speeds */}
          {[...Array(25)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              fontSize: `${10 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              animation: `fall ${6 + Math.random() * 6}s infinite linear`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.2,
              filter: `blur(${Math.random() * 2}px)`
            }}>
              {Math.random() > 0.5 ? '💔' : '🖤'}
            </div>
          ))}

          {/* Pulsing dark circles */}
          {[...Array(5)].map((_, i) => (
            <div key={`circle-${i}`} style={{
              position: 'absolute',
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,0,0,0.02) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${4 + Math.random() * 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }} />
          ))}
        </div>

        <style>
          {`
            @keyframes fall {
              0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
              10% { opacity: 0.3; }
              90% { opacity: 0.3; }
              100% { transform: translateY(110vh) rotate(720deg) scale(1.2); opacity: 0; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.1; }
              50% { transform: scale(1.3); opacity: 0.3; }
            }
            @keyframes flicker {
              0%, 100% { opacity: 0.4; }
              25% { opacity: 0.8; }
              50% { opacity: 0.3; }
              75% { opacity: 0.9; }
            }
            @keyframes typewriter {
              from { width: 0; }
              to { width: 100%; }
            }
            @keyframes glitch {
              0%, 100% { text-shadow: 2px 2px 4px rgba(255,0,0,0.3); }
              25% { text-shadow: -2px 2px 4px rgba(0,255,255,0.3); }
              50% { text-shadow: 2px -2px 4px rgba(255,0,255,0.3); }
              75% { text-shadow: -2px -2px 4px rgba(0,255,0,0.3); }
            }
          `}
        </style>

        {/* Main content with intelligent design */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(10,10,10,0.98) 0%, rgba(30,30,30,0.95) 100%)',
          borderRadius: '20px',
          padding: '50px 35px',
          maxWidth: '650px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 25px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Dynamic header based on click count */}
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '25px',
            animation: 'pulse 2s infinite, glitch 3s infinite',
            filter: 'grayscale(100%) contrast(1.5)'
          }}>
            💔
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)',
            color: '#888',
            marginBottom: '20px',
            fontWeight: '300',
            letterSpacing: '2px',
            animation: 'flicker 3s infinite',
            textTransform: 'uppercase'
          }}>
            {noClickCount === 11 ? 'Eleven Times...' :
              noClickCount <= 15 ? 'Still Saying No?' :
                'This Is Just Cruel'}
          </h1>

          {/* Intelligent messaging based on rejection count */}
          <p style={{
            fontSize: 'clamp(1rem, 2.8vw, 1.3rem)',
            color: '#777',
            marginBottom: '25px',
            fontStyle: 'italic',
            lineHeight: '1.9',
            animation: 'flicker 4s infinite reverse'
          }}>
            {noClickCount === 11 && 'After eleven deliberate attempts... the pattern is clear.'}
            {noClickCount > 11 && noClickCount <= 15 && `${noClickCount} times. The statistics don\'t lie.`}
            {noClickCount > 15 && `${noClickCount} rejections. This goes beyond coincidence into intent.`}
            <br />
            {noClickCount <= 13 && 'I understand now. Some questions were never meant to be answered.'}
            {noClickCount > 13 && noClickCount <= 20 && 'The data suggests a fundamental incompatibility.'}
            {noClickCount > 20 && 'At this point, this is statistical significance in rejection.'}
            <br />
            {noClickCount <= 15 && 'The darkest reality is acceptance.'}
            {noClickCount > 15 && 'Reality isn\'t just dark, it\'s mathematically proven.'}
          </p>

          {/* Progressive emotional damage indicator */}
          <div style={{
            fontSize: '1.5rem',
            marginBottom: '25px',
            opacity: Math.max(0.2, 1 - (noClickCount * 0.05)),
            animation: 'pulse 1.5s infinite'
          }}>
            {Array(Math.min(5, Math.floor(noClickCount / 3))).fill('💔').join(' ')}
            {noClickCount > 15 && Array(Math.min(3, Math.floor((noClickCount - 15) / 5))).fill('�').join(' ')}
          </div>

          {/* Philosophical quotes that get darker with more rejections */}
          <div style={{
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: '#666',
            fontStyle: 'italic',
            opacity: 0.8,
            marginBottom: '25px',
            padding: '20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            borderLeft: '3px solid rgba(255,0,0,0.2)'
          }}>
            {noClickCount <= 13 && '"The opposite of love is not hate, it\'s indifference. But this... this feels personal."'}
            {noClickCount > 13 && noClickCount <= 20 && '"In mathematics, probability becomes certainty. In love, rejection becomes truth."'}
            {noClickCount > 20 && '"Some patterns in life are as reliable as gravity. This rejection is one of them."'}
          </div>

          {/* Statistical analysis section */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.03)',
            textAlign: 'left'
          }}>
            <h3 style={{
              color: '#666',
              fontSize: '0.9rem',
              marginBottom: '15px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '400'
            }}>
              Statistical Analysis:
            </h3>
            <div style={{
              fontSize: '0.85rem',
              color: '#555',
              lineHeight: '1.8'
            }}>
              <div>Rejection Count: <span style={{ color: '#888', fontWeight: 'bold' }}>{noClickCount}</span></div>
              <div>Success Rate: <span style={{ color: '#888', fontWeight: 'bold' }}>0%</span></div>
              <div>Emotional Damage: <span style={{ color: '#888', fontWeight: 'bold' }}>{Math.min(100, noClickCount * 8)}%</span></div>
              <div>Probability of Change: <span style={{ color: '#888', fontWeight: 'bold' }}>{Math.max(0, 100 - noClickCount * 9)}%</span></div>
            </div>
          </div>

          {/* Final message */}
          <div style={{
            marginTop: '25px',
            fontSize: '0.8rem',
            color: '#444',
            fontStyle: 'italic',
            opacity: 0.6
          }}>
            {noClickCount <= 15 ? 'Every rejection is data point. The conclusion is clear.' :
              noClickCount <= 25 ? 'The algorithm of love has terminated with error code: REJECTION_OVERFLOW' :
                'Even machines understand when to stop trying.'}
          </div>
        </div>
      </div>
    );
  }

  if (!accepted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b9d 0%, #ffc371 50%, #ff6b9d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Floating hearts background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              fontSize: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3
            }}>
              ❤️
            </div>
          ))}
        </div>

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(10deg); }
            }
            @keyframes heartfall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }
          `}
        </style>

        {/* Main content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '30px',
          padding: '60px 40px',
          maxWidth: '600px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#ff1744',
            marginBottom: '20px',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            💝 Will You Be My Valentine? 💝
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: '#d81b60',
            marginBottom: '50px',
            fontStyle: 'italic'
          }}>
            I promise to make every day special! 🌹
          </p>

          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            marginTop: '40px',
            minHeight: '100px',
            flexWrap: 'wrap'
          }}>
            {/* Yes Button - Always static */}
            <button
              onClick={handleYesClick}
              style={{
                backgroundColor: '#ff4081',
                color: 'white',
                border: 'none',
                padding: '20px 50px',
                fontSize: '1.5rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(255, 64, 129, 0.4)',
                transition: 'all 0.3s ease',
                transform: `scale(${yesButtonSize})`,
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = `scale(${yesButtonSize * 1.1})`;
                e.target.style.boxShadow = '0 12px 30px rgba(255, 64, 129, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = `scale(${yesButtonSize})`;
                e.target.style.boxShadow = '0 8px 20px rgba(255, 64, 129, 0.4)';
              }}
            >
              Yes! 💕
            </button>

            {/* No Button - Static initially, then moves on interaction */}
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={noButtonPosition ? {
                // After interaction - fixed position that moves
                position: 'fixed',
                left: noButtonPosition.left,
                top: noButtonPosition.top,
                backgroundColor: '#9e9e9e',
                color: 'white',
                border: 'none',
                padding: '15px 35px',
                fontSize: '1.2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                zIndex: 1000
              } : {
                // Initial state - static position
                backgroundColor: '#9e9e9e',
                color: 'white',
                border: 'none',
                padding: '15px 35px',
                fontSize: '1.2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              No 😢
            </button>
          </div>

          <p style={{
            marginTop: '60px',
            fontSize: '0.9rem',
            color: '#e91e63',
            fontStyle: 'italic'
          }}>
            Hint: There's only one right answer! 😉
          </p>
        </div>
      </div>
    );
  }

  // Celebration Page
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      overflow: 'auto',
      position: 'relative'
    }}>
      {/* Falling hearts */}
      {hearts.map(heart => (
        <div key={heart.id} style={{
          position: 'fixed',
          left: `${heart.left}%`,
          top: '-50px',
          fontSize: `${heart.size}px`,
          animation: `heartfall ${heart.animationDuration}s linear`,
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          ❤️
        </div>
      ))}

      <div style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'pulse 2s infinite'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            color: 'white',
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
            marginBottom: '20px'
          }}>
            🎉 Yay! You Said Yes! 🎉
          </h1>
          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#fff',
            fontStyle: 'italic'
          }}>
            This is the beginning of our beautiful journey! 💑
          </p>
        </div>

        {/* Love Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {/* Card 1 - English Quote */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>💖</div>
            <h3 style={{ color: '#e91e63', marginBottom: '15px', fontSize: '1.3rem' }}>Love is...</h3>
            <p style={{ color: '#555', fontStyle: 'italic', lineHeight: '1.6' }}>
              "Love is not just looking at each other, it's looking in the same direction together."
            </p>
          </div>

          {/* Card 2 - Hindi Shayari */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>🌹</div>
            <h3 style={{ color: '#e91e63', marginBottom: '15px', fontSize: '1.3rem' }}>दिल की बात</h3>
            <p style={{ color: '#555', fontStyle: 'italic', lineHeight: '1.8' }}>
              तेरे बिना ये दिल धड़कता नहीं,<br />
              तेरे बिना ये ज़िन्दगी जीता नहीं,<br />
              तू है मेरी धड़कन, तू है मेरी जान,<br />
              तेरे साथ ही मेरी पहचान 💕
            </p>
          </div>

          {/* Card 3 - Promise */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>💑</div>
            <h3 style={{ color: '#e91e63', marginBottom: '15px', fontSize: '1.3rem' }}>My Promise</h3>
            <p style={{ color: '#555', fontStyle: 'italic', lineHeight: '1.6' }}>
              "I promise to cherish every moment with you, to make you smile every day, and to love you more with each passing second."
            </p>
          </div>

          {/* Card 4 - English Shayari */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>✨</div>
            <h3 style={{ color: '#e91e63', marginBottom: '15px', fontSize: '1.3rem' }}>Forever Yours</h3>
            <p style={{ color: '#555', fontStyle: 'italic', lineHeight: '1.8' }}>
              In your eyes, I found my home,<br />
              In your smile, my heart has grown,<br />
              With you beside me, I'm complete,<br />
              You make my life so sweet 🌟
            </p>
          </div>

          {/* Card 5 - Hindi Love */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>🎀</div>
            <h3 style={{ color: '#e91e63', marginBottom: '15px', fontSize: '1.3rem' }}>मोहब्बत</h3>
            <p style={{ color: '#555', fontStyle: 'italic', lineHeight: '1.8' }}>
              तेरी मुस्कान में मेरी खुशी है,<br />
              तेरी बाहों में मेरी दुनिया है,<br />
              तू मेरा प्यार है, तू मेरा जहां है,<br />
              तेरे साथ ही मेरी हर सुबह शाम है 💗
            </p>
          </div>

          {/* Card 6 - Celebration */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>🎊</div>
            <h3 style={{ color: '#e91e63', marginBottom: '15px', fontSize: '1.3rem' }}>Our Journey</h3>
            <p style={{ color: '#555', fontStyle: 'italic', lineHeight: '1.6' }}>
              "Every love story is beautiful, but ours is my favorite. Here's to endless adventures, laughter, and love! 🥂"
            </p>
          </div>
        </div>

        {/* Bottom Message */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '30px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: '#e91e63',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '20px'
          }}>
            🌟 You Made Me The Happiest! 🌟
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: '#555',
            lineHeight: '1.8',
            marginBottom: '15px'
          }}>
            Thank you for saying yes! I promise to fill your life with love, joy, and countless beautiful memories.
          </p>
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: '#e91e63',
            fontWeight: 'bold',
            fontStyle: 'italic'
          }}>
            Happy Valentine's Day, My Love! 💝
          </p>
          <div style={{
            fontSize: '4rem',
            marginTop: '20px',
            animation: 'pulse 1.5s infinite'
          }}>
            💖💕💗
          </div>
        </div>
      </div>
    </div>
  );
}
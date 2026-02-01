import React, { useState, useEffect, useCallback } from 'react';

interface Card {
  id: string;
  name: string;
  set: string;
  rarity: string;
  marketPrice: number;
  psaPrice: number;
  grade?: number;
  image: string;
  change: number;
}

const mockCards: Card[] = [
  { id: '1', name: 'Charizard VMAX', set: 'Shining Fates', rarity: 'Secret Rare', marketPrice: 187.50, psaPrice: 450, grade: 10, image: '🔥', change: 12.5 },
  { id: '2', name: 'Pikachu VMAX', set: 'Vivid Voltage', rarity: 'Rainbow Rare', marketPrice: 245.00, psaPrice: 580, grade: 9, image: '⚡', change: -3.2 },
  { id: '3', name: 'Mewtwo GX', set: 'Hidden Fates', rarity: 'Shiny', marketPrice: 89.99, psaPrice: 220, grade: 10, image: '🔮', change: 8.7 },
  { id: '4', name: 'Umbreon VMAX', set: 'Evolving Skies', rarity: 'Alt Art', marketPrice: 312.00, psaPrice: 750, image: '🌙', change: 24.1 },
  { id: '5', name: 'Rayquaza VMAX', set: 'Evolving Skies', rarity: 'Alt Art', marketPrice: 275.50, psaPrice: 620, grade: 9, image: '🐉', change: 5.3 },
  { id: '6', name: 'Mew VMAX', set: 'Fusion Strike', rarity: 'Alt Art', marketPrice: 156.00, psaPrice: 380, image: '✨', change: -1.8 },
];

const Scanner: React.FC<{ onScan: (card: Card) => void; isScanning: boolean; setIsScanning: (v: boolean) => void }> = ({ onScan, isScanning, setIsScanning }) => {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            const randomCard = mockCards[Math.floor(Math.random() * mockCards.length)];
            onScan({ ...randomCard, id: Date.now().toString() });
            return 0;
          }
          return p + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isScanning, onScan, setIsScanning]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="gradient-border rounded-3xl overflow-hidden bg-[#151520]">
        <div className="relative aspect-[3/4] bg-gradient-to-br from-[#1a1a25] to-[#0d0d15] overflow-hidden">
          {/* Camera viewfinder overlay */}
          <div className="absolute inset-4 border-2 border-[#ADFF2F]/30 rounded-2xl">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#ADFF2F] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#ADFF2F] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#ADFF2F] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#ADFF2F] rounded-br-xl" />
          </div>
          
          {/* Scan line effect */}
          {isScanning && (
            <div className="absolute inset-x-4 top-4 h-1 bg-gradient-to-r from-transparent via-[#ADFF2F] to-transparent animate-scan-line shadow-[0_0_20px_#ADFF2F]" />
          )}
          
          {/* Center card placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-48 h-64 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center ${isScanning ? 'border-[#ADFF2F] bg-[#ADFF2F]/10' : 'border-white/20'}`}>
              {!isScanning ? (
                <div className="text-center text-white/40">
                  <div className="text-5xl mb-3">🃏</div>
                  <p className="text-sm font-medium">Place card here</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl animate-float">📸</div>
                  <p className="text-[#ADFF2F] font-mono text-sm mt-2">Scanning...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          {isScanning && (
            <div className="absolute bottom-6 left-6 right-6">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ADFF2F] to-[#FFD700] transition-all duration-100"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="text-center text-white/60 text-xs mt-2 font-mono">{scanProgress}%</p>
            </div>
          )}
        </div>
        
        {/* Scan button */}
        <div className="p-6">
          <button
            onClick={() => !isScanning && setIsScanning(true)}
            disabled={isScanning}
            className={`w-full py-4 rounded-2xl font-archivo text-lg tracking-wide transition-all duration-300 ${
              isScanning 
                ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#ADFF2F] to-[#7FFF00] text-black hover:shadow-[0_0_40px_rgba(173,255,47,0.5)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isScanning ? 'SCANNING...' : 'SCAN CARD'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CardResult: React.FC<{ card: Card; onClose: () => void }> = ({ card, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in" onClick={onClose}>
      <div className="bg-[#151520] rounded-3xl p-6 max-w-sm w-full gradient-border noise-overlay" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {/* Card visual */}
          <div className="card-holographic rounded-2xl p-8 mb-6 text-center">
            <div className="text-8xl mb-4">{card.image}</div>
            <h3 className="font-archivo text-2xl text-white mb-1">{card.name}</h3>
            <p className="text-white/60 text-sm">{card.set}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#ADFF2F]/20 text-[#ADFF2F] text-xs rounded-full font-medium">
              {card.rarity}
            </span>
          </div>
          
          {/* Price info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Market Price</p>
              <p className="font-archivo text-2xl text-white">${card.marketPrice.toFixed(2)}</p>
              <span className={`text-xs font-mono ${card.change >= 0 ? 'text-[#ADFF2F]' : 'text-red-400'}`}>
                {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change)}%
              </span>
            </div>
            <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#FF8C00]/20 rounded-xl p-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">PSA 10 Price</p>
              <p className="font-archivo text-2xl text-[#FFD700]">${card.psaPrice}</p>
              {card.grade && (
                <span className="text-xs font-mono text-[#FFD700]">Grade: {card.grade}</span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-[#ADFF2F] text-black rounded-xl font-semibold hover:bg-[#7FFF00] transition-colors">
              Add to Collection
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionCard: React.FC<{ card: Card; index: number }> = ({ card, index }) => {
  return (
    <div 
      className="bg-[#151520] rounded-2xl p-4 gradient-border hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-holographic rounded-xl p-4 mb-3 text-center">
        <div className="text-4xl">{card.image}</div>
      </div>
      <h4 className="font-semibold text-white text-sm truncate">{card.name}</h4>
      <p className="text-white/40 text-xs truncate">{card.set}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="font-archivo text-[#ADFF2F]">${card.marketPrice.toFixed(0)}</span>
        <span className={`text-xs ${card.change >= 0 ? 'text-[#ADFF2F]' : 'text-red-400'}`}>
          {card.change >= 0 ? '+' : ''}{card.change}%
        </span>
      </div>
    </div>
  );
};

const Stats: React.FC<{ collection: Card[] }> = ({ collection }) => {
  const totalValue = collection.reduce((sum, c) => sum + c.marketPrice, 0);
  const topCard = collection.length > 0 
    ? collection.reduce((max, c) => c.marketPrice > max.marketPrice ? c : max, collection[0])
    : null;
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-[#151520] rounded-2xl p-4 gradient-border">
        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
          <span>📊</span> Total Cards
        </div>
        <p className="font-archivo text-3xl text-[#ADFF2F]">{collection.length}</p>
      </div>
      <div className="bg-[#151520] rounded-2xl p-4 gradient-border">
        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
          <span>💰</span> Total Value
        </div>
        <p className="font-archivo text-3xl text-[#FFD700]">${totalValue.toFixed(0)}</p>
      </div>
      <div className="bg-[#151520] rounded-2xl p-4 gradient-border">
        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
          <span>🏆</span> Top Card
        </div>
        <p className="font-archivo text-xl text-white truncate">{topCard?.name || '-'}</p>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; highlight: string; emoji: string; desc: string; delay: number }> = ({ title, highlight, emoji, desc, delay }) => (
  <div 
    className="gold-texture rounded-2xl p-1 noise-overlay animate-slide-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="bg-[#0a0a0f]/90 rounded-xl p-4 h-full">
      <div className="flex items-center gap-1 mb-2">
        <span className="font-archivo text-lg text-white">{title}</span>
        <span className="font-archivo text-lg text-[#ADFF2F]">{highlight}</span>
      </div>
      <div className="text-4xl mb-2">{emoji}</div>
      <p className="text-white/60 text-sm">{desc}</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'collection' | 'prices'>('scan');
  const [collection, setCollection] = useState<Card[]>([]);
  const [scannedCard, setScannedCard] = useState<Card | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = useCallback((card: Card) => {
    setScannedCard(card);
  }, []);

  const addToCollection = useCallback(() => {
    if (scannedCard) {
      setCollection(prev => [...prev, scannedCard]);
      setScannedCard(null);
    }
  }, [scannedCard]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1493] to-[#8B008B] flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">🃏</span>
            </div>
            <div>
              <h1 className="font-archivo text-xl text-white">Card<span className="text-[#ADFF2F]">Vault</span></h1>
              <p className="text-white/40 text-xs">TCG Value Scanner</p>
            </div>
          </div>
          
          {/* Nav tabs */}
          <nav className="flex gap-1 bg-white/5 rounded-full p-1">
            {(['scan', 'collection', 'prices'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-[#ADFF2F] text-black' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'scan' && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="font-archivo text-4xl mb-2">
                <span className="text-glow text-[#ADFF2F]">Scan</span> Your Cards
              </h2>
              <p className="text-white/60">Point your camera at any TCG card to get instant valuations</p>
            </div>
            
            <Scanner onScan={handleScan} isScanning={isScanning} setIsScanning={setIsScanning} />
            
            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <FeatureCard title="BULK" highlight="SCAN" emoji="📱" desc="Scan multiple cards at once" delay={0.1} />
              <FeatureCard title="EBAY" highlight="Prices" emoji="💵" desc="Live market prices" delay={0.2} />
              <FeatureCard title="PSA" highlight="Grades" emoji="📊" desc="Graded card values" delay={0.3} />
              <FeatureCard title="Track" highlight="Cards" emoji="📈" desc="Monitor your collection" delay={0.4} />
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="font-archivo text-4xl mb-2">
                Your <span className="text-glow text-[#FFD700]">Collection</span>
              </h2>
              <p className="text-white/60">Track and manage your TCG portfolio</p>
            </div>
            
            <Stats collection={collection} />
            
            {collection.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="font-archivo text-xl text-white mb-2">No cards yet</h3>
                <p className="text-white/60 mb-4">Scan your first card to start your collection</p>
                <button 
                  onClick={() => setActiveTab('scan')}
                  className="px-6 py-3 bg-[#ADFF2F] text-black rounded-xl font-semibold hover:bg-[#7FFF00] transition-colors"
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {collection.map((card, i) => (
                  <CollectionCard key={card.id} card={card} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="font-archivo text-4xl mb-2">
                Market <span className="text-glow text-[#ADFF2F]">Prices</span>
              </h2>
              <p className="text-white/60">Top trending cards and their current values</p>
            </div>
            
            <div className="bg-[#151520] rounded-3xl overflow-hidden gradient-border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <div className="col-span-5">Card</div>
                <div className="col-span-2 text-right">Market</div>
                <div className="col-span-2 text-right">PSA 10</div>
                <div className="col-span-3 text-right">Change</div>
              </div>
              {mockCards.map((card, i) => (
                <div 
                  key={card.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ADFF2F]/20 to-[#FFD700]/20 flex items-center justify-center text-xl">
                      {card.image}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{card.name}</p>
                      <p className="text-white/40 text-xs">{card.set}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-right flex items-center justify-end">
                    <span className="font-mono text-white">${card.marketPrice.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 text-right flex items-center justify-end">
                    <span className="font-mono text-[#FFD700]">${card.psaPrice}</span>
                  </div>
                  <div className="col-span-3 text-right flex items-center justify-end">
                    <span className={`px-2 py-1 rounded-lg text-xs font-mono ${
                      card.change >= 0 
                        ? 'bg-[#ADFF2F]/20 text-[#ADFF2F]' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {card.change >= 0 ? '+' : ''}{card.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-white/30 text-xs">
          Requested by <a href="https://twitter.com/0xPaulius" className="hover:text-white/50 transition-colors">@0xPaulius</a> · Built by <a href="https://twitter.com/clonkbot" className="hover:text-white/50 transition-colors">@clonkbot</a>
        </p>
      </footer>

      {/* Card Result Modal */}
      {scannedCard && (
        <CardResult 
          card={scannedCard} 
          onClose={() => {
            addToCollection();
          }} 
        />
      )}
    </div>
  );
};

export default App;
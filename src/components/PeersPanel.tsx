import React from 'react';
import { PeerBaby } from '../engine/types';
import { Globe2 } from 'lucide-react';

interface PeersPanelProps {
  peers: PeerBaby[];
  playerAge: number;
}

export const PeersPanel: React.FC<PeersPanelProps> = ({ peers, playerAge }) => {
  return (
    <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-5 shadow-xs text-left">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-parchment-200">
        <Globe2 className="w-4 h-4 text-rust" />
        <div>
          <h3 className="font-serif text-base font-bold text-ink">
            Same-Second Peers
          </h3>
          <p className="text-[11px] text-ink-light">
            4 babies born across the globe at the exact same moment
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {peers.map((peer) => {
          return (
            <div
              key={peer.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                peer.isAlive
                  ? 'border-parchment-200 bg-parchment-100/60'
                  : 'border-parchment-300/80 bg-parchment-200/50 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <span className="text-base">{peer.flag}</span>
                  <span>{peer.name}</span>
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    peer.isAlive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {peer.isAlive ? `Age ${playerAge}` : `Died age ${peer.deathAge}`}
                </span>
              </div>

              <div className="text-[11px] text-ink-light font-medium mb-1">
                {peer.countryName} ({peer.sex})
              </div>

              <p className="text-[11px] text-ink-light/90 leading-tight">
                {peer.currentMilestone}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

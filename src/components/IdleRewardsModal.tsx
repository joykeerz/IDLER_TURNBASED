import React from 'react'

interface IdleRewardsModalProps {
  timeOffline: string
  gold: number
  gems: number
  onClaim: () => void
}

const IdleRewardsModal: React.FC<IdleRewardsModalProps> = ({ timeOffline, gold, gems, onClaim }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h2 className="modal-title">WELCOME BACK!</h2>
          <p className="modal-subtitle">
            You were away for <b>{timeOffline}</b>
          </p>

          <div className="rewards-grid">
            <div className="reward-item">
              <div className="reward-icon-circle reward-icon-gold">💰</div>
              <span className="reward-value text-yellow-400">+{gold.toLocaleString()}</span>
              <span className="reward-label">Gold</span>
            </div>

            <div className="reward-item">
              <div className="reward-icon-circle reward-icon-gem">💎</div>
              <span className="reward-value text-purple-400">+{gems.toLocaleString()}</span>
              <span className="reward-label">Gems</span>
            </div>
          </div>

          <button className="modal-button" onClick={onClaim}>
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  )
}

export default IdleRewardsModal

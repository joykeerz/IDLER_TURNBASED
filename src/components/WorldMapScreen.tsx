import { useState } from 'react'
import { STAGES, Stage } from '../data/stages'

interface WorldMapScreenProps {
  gameState: any
  onBack: () => void
  onStartBattle: (stageId: number) => void
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: '#2ecc71',
  Normal: '#f1c40f',
  Hard: '#e67e22',
  Expert: '#e74c3c',
}

const CHAPTER_IDS = [...new Set(STAGES.map(s => s.chapterId))]

const WorldMapScreen = ({ gameState, onBack, onStartBattle }: WorldMapScreenProps) => {
  const [selectedStage, setSelectedStage] = useState<Stage>(
    STAGES[Math.max(0, (gameState.currentStage ?? 1) - 1)]
  )
  const [activeChapter, setActiveChapter] = useState(
    STAGES[Math.max(0, (gameState.currentStage ?? 1) - 1)]?.chapterId ?? 1
  )

  const clearedStages: number[] = gameState.clearedStages ?? []
  const unlockedUpTo: number = gameState.currentStage ?? 1

  const getStageStatus = (stage: Stage): 'cleared' | 'current' | 'locked' => {
    if (clearedStages.includes(stage.id)) return 'cleared'
    if (stage.id === unlockedUpTo) return 'current'
    return 'locked'
  }

  const chapterStages = STAGES.filter(s => s.chapterId === activeChapter)
  const chapterInfo = chapterStages[0]
  const selectedStatus = getStageStatus(selectedStage)

  return (
    <div className="screen-world">
      {/* Header */}
      <div className="world-header">
        <button className="world-back-btn" onClick={onBack}>
          <span>◀</span> BACK
        </button>
        <div className="world-title">
          <span className="world-title-sub">CHAPTER {activeChapter}</span>
          <span className="world-title-main">{chapterInfo?.chapterName ?? ''}</span>
        </div>
        <div className="world-header-right">
          <span className="world-cleared-count">
            {clearedStages.length} / {STAGES.length} CLEARED
          </span>
        </div>
      </div>

      {/* Chapter Tabs */}
      <div className="world-chapter-tabs">
        {CHAPTER_IDS.map(cid => {
          const chStages = STAGES.filter(s => s.chapterId === cid)
          const chName = chStages[0]?.chapterName
          const chCleared = chStages.filter(s => clearedStages.includes(s.id)).length
          const chTotal = chStages.length
          const isUnlocked = chStages[0]?.id <= unlockedUpTo
          return (
            <button
              key={cid}
              className={`chapter-tab ${activeChapter === cid ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => {
                if (!isUnlocked) return
                setActiveChapter(cid)
                const firstStage = chStages[0]
                if (firstStage) setSelectedStage(firstStage)
              }}
            >
              <span className="chapter-tab-num">CH.{cid}</span>
              <span className="chapter-tab-name">{chName}</span>
              <span className="chapter-tab-progress">{chCleared}/{chTotal}</span>
            </button>
          )
        })}
      </div>

      {/* Main Body */}
      <div className="world-body">
        {/* Stage Node List */}
        <div className="stage-list">
          {chapterStages.map((stage, i) => {
            const status = getStageStatus(stage)
            return (
              <div
                key={stage.id}
                className={`stage-node ${status} ${selectedStage.id === stage.id ? 'selected' : ''}`}
                onClick={() => { if (status !== 'locked') setSelectedStage(stage) }}
              >
                <div className="stage-node-number">{stage.chapterId}-{i + 1}</div>
                <div className="stage-node-info">
                  <div className="stage-node-name">{stage.name}</div>
                  <div className="stage-node-diff" style={{ color: DIFFICULTY_COLOR[stage.difficulty] }}>
                    {stage.difficulty}
                  </div>
                </div>
                <div className="stage-node-status">
                  {status === 'cleared' && <span className="status-icon cleared">✓</span>}
                  {status === 'current' && <span className="status-icon current">►</span>}
                  {status === 'locked' && <span className="status-icon locked">🔒</span>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Stage Detail Panel */}
        <div className="stage-detail-panel">
          <div className="detail-stage-id">
            STAGE {selectedStage.chapterId}-{chapterStages.findIndex(s => s.id === selectedStage.id) + 1}
          </div>
          <div className="detail-stage-name">{selectedStage.name}</div>
          <div
            className="detail-difficulty-badge"
            style={{ borderColor: DIFFICULTY_COLOR[selectedStage.difficulty], color: DIFFICULTY_COLOR[selectedStage.difficulty] }}
          >
            {selectedStage.difficulty}
          </div>

          <p className="detail-lore">{selectedStage.lore}</p>

          <div className="detail-section-label">ENEMIES</div>
          <div className="detail-enemies">
            {selectedStage.enemies.map(enemy => (
              <div key={enemy.id} className="detail-enemy-card">
                <div
                  className="detail-enemy-art"
                  style={{ backgroundImage: enemy.splashArt ? `url(${enemy.splashArt})` : 'none' }}
                >
                  {!enemy.splashArt && <span style={{ fontSize: '2rem' }}>👹</span>}
                </div>
                <div className="detail-enemy-name">{enemy.name}</div>
                <div className="detail-enemy-hp">❤ {enemy.hp.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="detail-section-label">REWARDS</div>
          <div className="detail-rewards">
            <div className="reward-item">
              <span>🪙</span>
              <span>{selectedStage.rewards.gold.toLocaleString()}</span>
            </div>
            <div className="reward-item">
              <span>💎</span>
              <span>{selectedStage.rewards.gems}</span>
            </div>
          </div>

          <div className="detail-rec-power">
            <span className="rec-label">REC. POWER</span>
            <span className="rec-value">{selectedStage.recommendedPower.toLocaleString()}</span>
          </div>

          <button
            className={`world-battle-btn ${selectedStatus === 'locked' ? 'disabled' : ''}`}
            onClick={() => {
              if (selectedStatus !== 'locked') onStartBattle(selectedStage.id)
            }}
            disabled={selectedStatus === 'locked'}
          >
            {selectedStatus === 'cleared' ? '↺ REPLAY' : selectedStatus === 'locked' ? '🔒 LOCKED' : '▶ START BATTLE'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorldMapScreen

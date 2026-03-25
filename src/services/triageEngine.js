const WEIGHTS = {
  AIRWAY_OBSTRUCTED: 40,
  BREATHING_RR_ABNORMAL: 20,
  BREATHING_SPO2_LOW: 25,
  CIRCULATION_SBP_LOW: 30,
  CIRCULATION_PULSE_ABSENT: 30,
  CIRCULATION_PR_ABNORMAL: 15,
  CIRCULATION_CRT_HIGH: 15,
  DISABILITY_SEVERE: 35,
  DISABILITY_MODERATE: 20
}

const THRESHOLDS = {
  RED: 40,
  YELLOW: 15
}

const calculateTriage = (inputs) => {

  // STEP 1 — Fast Track Check
  if (inputs.fast_track === true) {
    return {
      severity_level: 'RED',
      fast_track: true,
      fast_track_reason: inputs.fast_track_reason,
      total_score: 100,
      parameter_scores: null
    }
  }

  // STEP 2 — Score Each Parameter
  const airway_score = scoreAirway(inputs.airway_status)
  const breathing_score = scoreBreathing(inputs.respiratory_rate, inputs.spo2)
  const circulation_score = scoreCirculation(
    inputs.pulse_rate,
    inputs.sbp,
    inputs.crt
  )
  const disability_score = scoreDisability(inputs.avpu)

  const parameter_scores = {
    AIRWAY: airway_score,
    BREATHING: breathing_score,
    CIRCULATION: circulation_score,
    DISABILITY: disability_score
  }

  // STEP 3 — Total Score
  const total_score = airway_score.points
    + breathing_score.points
    + circulation_score.points
    + disability_score.points

  // STEP 4 — Classify
  let severity_level
  if (total_score >= THRESHOLDS.RED) {
    severity_level = 'RED'
  } else if (total_score >= THRESHOLDS.YELLOW) {
    severity_level = 'YELLOW'
  } else {
    severity_level = 'GREEN'
  }

  // STEP 5 — Vulnerable population override
  // Pregnant or pediatric with any score > 0 → minimum YELLOW
  if (inputs.vulnerable_population === true
    && severity_level === 'GREEN'
    && total_score > 0) {
    severity_level = 'YELLOW'
  }

  return {
    severity_level,
    fast_track: false,
    fast_track_reason: 'NONE',
    total_score,
    parameter_scores
  }
}

// --- Individual Scoring Functions ---

const scoreAirway = (airway_status) => {
  if (airway_status === 'OBSTRUCTED') {
    return { color: 'RED', points: WEIGHTS.AIRWAY_OBSTRUCTED }
  }
  return { color: 'GREEN', points: 0 }
}

const scoreBreathing = (rr, spo2) => {
  let points = 0
  if (rr < 10 || rr > 24) points += WEIGHTS.BREATHING_RR_ABNORMAL
  if (spo2 < 95) points += WEIGHTS.BREATHING_SPO2_LOW
  const color = points >= THRESHOLDS.RED ? 'RED'
    : points >= THRESHOLDS.YELLOW ? 'YELLOW' : 'GREEN'
  return { color, points }
}

const scoreCirculation = (pr, sbp, crt) => {
  let points = 0
  if (sbp < 90) points += WEIGHTS.CIRCULATION_SBP_LOW
  if (pr < 50 || pr > 100) points += WEIGHTS.CIRCULATION_PR_ABNORMAL
  if (crt === 'MORE_THAN_2') points += WEIGHTS.CIRCULATION_CRT_HIGH
  const color = points >= THRESHOLDS.RED ? 'RED'
    : points >= THRESHOLDS.YELLOW ? 'YELLOW' : 'GREEN'
  return { color, points }
}

const scoreDisability = (avpu) => {
  if (avpu === 'PAIN' || avpu === 'UNRESPONSIVE') {
    return { color: 'RED', points: WEIGHTS.DISABILITY_SEVERE }
  }
  if (avpu === 'VOICE') {
    return { color: 'YELLOW', points: WEIGHTS.DISABILITY_MODERATE }
  }
  return { color: 'GREEN', points: 0 }
}

module.exports = { calculateTriage }
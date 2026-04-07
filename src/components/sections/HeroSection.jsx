import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-xs font-mono" style={{ color: '#4b5563' }}>스크롤</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6l4 4 4-4" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-8 py-24 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217,119,87,0.08) 0%, transparent 65%)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <motion.div variants={item}>
          <span
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full mb-8"
            style={{ color: '#d97757', background: 'rgba(217,119,87,0.10)', border: '1px solid rgba(217,119,87,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            datagsm-server 실전 가이드
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-bold tracking-tight mb-6"
          style={{ fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1.15, color: '#f5f0e8' }}
        >
          <span className="block">Claude Code</span>
          <span className="block" style={{ color: '#d97757' }}>하네스 꾸미기</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-base md:text-lg leading-relaxed mb-3 max-w-2xl mx-auto font-mono"
          style={{ color: '#6b7280' }}
        >
          datagsm-server 레포지터리로 보는
        </motion.p>
        <motion.p
          variants={item}
          className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
          style={{ color: '#9ca3af' }}
        >
          Hook · Skill · Sub-Agent · CLAUDE.md · Context Window —{' '}
          <span style={{ color: '#f5f0e8' }}>실전 Claude Code 설정법</span>
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {['Hooks', 'Skills', 'CLAUDE.md', 'Context Window', 'Sub-Agents', 'settings.json'].map((label) => (
            <span
              key={label}
              className="text-sm font-mono px-3 py-1.5 rounded-lg"
              style={{ color: '#9ca3af', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.button
          variants={item}
          onClick={() => document.getElementById('hooks')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer mb-24"
          style={{ background: '#d97757', color: '#0b0d0e' }}
          whileHover={{ scale: 1.03, background: '#e8896a' }}
          whileTap={{ scale: 0.98 }}
        >
          시작하기
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  )
}

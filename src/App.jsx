import Layout from './components/layout/Layout'
import HeroSection from './components/sections/HeroSection'
import HooksSection from './components/sections/HooksSection'
import SkillsSection from './components/sections/SkillsSection'
import ClaudeMdSection from './components/sections/ClaudeMdSection'
import ContextWindowSection from './components/sections/ContextWindowSection'
import SubAgentsSection from './components/sections/SubAgentsSection'
import SettingsSection from './components/sections/SettingsSection'

export default function App() {
  return (
    <Layout>
      <HeroSection />
      <HooksSection />
      <SkillsSection />
      <ClaudeMdSection />
      <ContextWindowSection />
      <SubAgentsSection />
      <SettingsSection />
    </Layout>
  )
}

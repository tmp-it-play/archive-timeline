import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import { useActiveSection } from '../../hooks/useActiveSection'
import { navItems } from '../../data/navigation'
import PropTypes from 'prop-types'

export default function Layout({ children }) {
  const sectionIds = navItems.map(item => item.id)
  const activeId = useActiveSection(sectionIds)

  return (
    <div className="min-h-screen" style={{ background: '#0b0d0e' }}>
      <Sidebar activeId={activeId} />
      <MobileNav activeId={activeId} />

      <main
        className="lg:ml-[240px] pt-14 lg:pt-0"
      >
        {children}
      </main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

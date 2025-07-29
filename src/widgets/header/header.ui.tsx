import { Container, useMediaQuery } from '@mui/material'
import { Navigate } from '~features/navigation'
import { useTheme } from '@mui/material/styles'

export const Header: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg rounded-b-2xl mb-10 py-2">
      <Container className="max-w-[1440px]">
        <Navigate />
      </Container>
    </header>
  )
}

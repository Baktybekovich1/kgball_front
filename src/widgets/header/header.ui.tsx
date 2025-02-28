import { Container, useMediaQuery } from '@mui/material'
import { Navigate } from '~features/navigation'
import { useTheme } from '@mui/material/styles'

export const Header: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <header className='bg-alto r-sm:mb-0 mb-10'>
      <Container className="max-w-[1440px]">
        <Navigate />
      </Container>
    </header>
  )
}

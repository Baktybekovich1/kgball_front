import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom'

import { errorPageRoute } from '~pages/error'
import { homePageRoute } from '~pages/home'
import { playersPageRoute } from '~pages/players'
import { playerPageRoute } from '~pages/player'
import { teamsPageRoute } from '~pages/teams'
import { matchesPageRoute } from '~pages/matches'
import { tournamentsPageRoute } from '~pages/tournaments'
import { GenericLayout } from '~app/layout'

function BubbleError() {
  const error = useRouteError()
  if (error instanceof Error) {
    console.error('Route Error:', error.message)
  } else {
    console.error('Unknown Route Error:', error)
  }
  return (
    <div className="text-center text-red-500">
      <h1>Ошибка!</h1>
      <p>Что-то пошло не так. Пожалуйста, попробуйте позже.</p>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <GenericLayout />,
    errorElement: <BubbleError />,
    children: [
      homePageRoute,
      playersPageRoute,
      playerPageRoute,
      teamsPageRoute,
      tournamentsPageRoute,
      matchesPageRoute,
      errorPageRoute,
    ],
  },
])

export function BrowserRouter() {
  return <RouterProvider router={router} />
}


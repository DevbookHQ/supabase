export const utilsInitSupabase = `import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  // NEXT_PUBLIC_SUPABASE_URL,
  // NEXT_PUBLIC_SUPABASE_ANON_KEY,
)`

export const pagesAPIGetUser = `import { supabase } from '../../utils/initSupabase'

// Example of how to verify and get user data server-side.
const getUser = async (req, res) => {
  const token = req.headers.token

  const { data: user, error } = await supabase.auth.api.getUser(token)

  if (error) return res.status(401).json({ error: error.message })
  return res.status(200).json(user)
}

export default getUser`

export const pagesAPIAuth = `/**
 * NOTE: this file is only needed if you're doing SSR (getServerSideProps)!
 */
import { supabase } from '../../utils/initSupabase'

export default function handler(req: any, res: any) {
  supabase.auth.api.setAuthCookie(req, res)
}`

export const pagesProfile = `import Link from 'next/link'
import { Card, Typography, Space } from '@supabase/ui'
import { supabase } from '../utils/initSupabase'

export default function Profile({ user }: { user: any }) {
  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
      <Card>
        <Space direction="vertical" size={6}>
          <Typography.Text>You're signed in</Typography.Text>
          <Typography.Text strong>Email: {user.email}</Typography.Text>
          <Typography.Text type="success">
            User data retrieved server-side (from Cookie in getServerSideProps):
          </Typography.Text>

          <Typography.Text>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </Typography.Text>

          <Typography.Text>
            <Link href="/">
              <a>Static example with useSWR</a>
            </Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  )
}

export async function getServerSideProps({ req }: { req: any }) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }

  // If there is a user, return it.
  return { props: { user } }
}`

export const pagesIndex = `import Link from 'next/link'
import useSWR from 'swr'
import { Auth, Card, Typography, Space, Button, Icon } from '@supabase/ui'
import { supabase } from '../utils/initSupabase'
import { useEffect, useState } from 'react'

const fetcher = (url: string, token: string) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json())

const Index = () => {
  const { user, session } = Auth.useUser()
  const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetcher)
  const [authView, setAuthView] = useState('sign_in')

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setAuthView('forgotten_password')
      if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
      // Send session to /api/auth route to set the auth cookie.
      // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
      fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json())
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  const View = () => {
    if (!user)
      return (
        <Space direction="vertical" size={8}>
          <div>
            <img src="https://app.supabase.io/img/supabase-dark.svg" width="96" />
            <Typography.Title level={3}>Welcome to Supabase Auth</Typography.Title>
          </div>
          <Auth
            supabaseClient={supabase}
            providers={['google', 'github']}
            view={authView}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Space>
      )

    return (
      <Space direction="vertical" size={6}>
        {authView === 'forgotten_password' && <Auth.UpdatePassword supabaseClient={supabase} />}
        {user && (
          <>
            <Typography.Text>You're signed in</Typography.Text>
            <Typography.Text strong>Email: {user.email}</Typography.Text>

            <Button
              icon={<Icon type="LogOut" />}
              type="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Log out
            </Button>
            {error && <Typography.Text type="danger">Failed to fetch user!</Typography.Text>}
            {data && !error ? (
              <>
                <Typography.Text type="success">
                  User data retrieved server-side (in API route):
                </Typography.Text>

                <Typography.Text>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </Typography.Text>
              </>
            ) : (
              <div>Loading...</div>
            )}

            <Typography.Text>
              <Link href="/profile">
                <a>SSR example with getServerSideProps</a>
              </Link>
            </Typography.Text>
          </>
        )}
      </Space>
    )
  }

  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }}>
      <Card>
        <View />
      </Card>
    </div>
  )
}

export default Index`

export const pagesApp = `import { Auth } from '@supabase/ui'
import { supabase } from '../utils/initSupabase'

export default function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return (
    <main className={'dark'}>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </Auth.UserContextProvider>
    </main>
  )
}`

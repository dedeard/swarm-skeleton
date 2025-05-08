import AppleIcon from '@/components/icons/AppleIcon'
import FacebookIcon from '@/components/icons/FacebookIcon'
import GithubIcon from '@/components/icons/GithubIcon'
import GoogleIcon from '@/components/icons/GoogleIcon'

const allowedSSOProviders = ['google', 'apple', 'facebook', 'github']

const providers = [
  {
    label: 'Google',
    provider: 'google',
    icon: GoogleIcon,
  },
  {
    label: 'Apple',
    provider: 'apple',
    icon: AppleIcon,
  },
  {
    label: 'Facebook',
    provider: 'facebook',
    icon: FacebookIcon,
  },
  {
    label: 'GitHub',
    provider: 'github',
    icon: GithubIcon,
  },
]

const authConfig = {
  allowedSSOProviders,
  providers,
}

export default authConfig

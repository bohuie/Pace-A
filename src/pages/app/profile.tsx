import Profile from '../../components/Profile/Profile'
import Layout from '../../components/layout'
import NoAuthCard from '../../components/NoAuthCard'
import nookies from 'nookies'
import { firebaseAdmin } from '../../lib/auth/firebaseAdmin'
import { getUserType, getUser, getOrg } from '../../utils/api'

const ProfilePage = (props) => {
  const auth = props.auth
  const user = JSON.parse(props.user)
  const org = JSON.parse(props.org)
  const usertype = props.usertype

  return (
    <Layout title='Profile' needsAuth auth={auth} usertype={usertype}>
      <Profile user={user} org={org} usertype={usertype} />
    </Layout>
  )
}

export const getServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context)
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
    const uid = token.uid
    const usertype = await getUserType(uid)
    const user = await getUser(uid)
    const org = await getOrg(uid)

    return {
      props: { 
        auth: true,
        user: JSON.stringify(user),
        org: JSON.stringify(org),
        usertype: usertype
      },
    };
  } catch (error) {
    console.log(error)
    return {
      props: {
        auth: false,
        user: null,
        org: null,
        usertype: null
      },
    };
  }
};

export default ProfilePage
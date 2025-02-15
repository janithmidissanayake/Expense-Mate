import { useAuth } from "../context/AuthProvider"
const Helloworld = () => {
  const { user } = useAuth(); // Access the user data from AuthContext

  return (
    <div>Welcome! {user?.firstName}</div>
  )
}

export default Helloworld
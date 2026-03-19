import { observer } from "mobx-react-lite"
import { LoginForm } from "../../components/auth/LoginForm"

export const LoginPage = observer(() => {
  return(
    <LoginForm></LoginForm>
  )
})
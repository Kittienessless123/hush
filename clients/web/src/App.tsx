import "./App.css";
import { AppRouter } from "./app/routing";
 import { Providers } from "./app/providers";
import { rootStore } from "./store/root.store";

 rootStore.authStore.checkAuth();

const App = () => {
   return (
    <Providers>
       <AppRouter />
    </Providers>
  );
};

export default App;
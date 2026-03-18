import "./App.css";
import { AppRouter } from "./app/routing";
 import { Providers } from "./app/providers";

 
const App = () => {
   return (
    <Providers>
       <AppRouter />
    </Providers>
  );
};

export default App;
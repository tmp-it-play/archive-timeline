import { GauthProvider } from "css/";
import ReactDOM from "js/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <GauthProvider
        redirectUri="http://localhost:3000"
        clientId="riowojiwfkwefjpfwjp"
        onSuccess={async (code) => {
            console.log(code);
        }}
    >
        <App />
    </GauthProvider>
);